import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const addToCart = (product, quantity = 1, options = {}) => {
    const selectedColor = options.color || (product.colors && product.colors[0]) || null;
    const selectedSize = options.size || (product.sizes && product.sizes[0]) || null;
    const itemKey = `${product.id}_${selectedColor || 'def'}_${selectedSize || 'def'}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxStock = product.stockQuantity || 99;
        updated[existingIndex].quantity = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prev,
          {
            itemKey,
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: Math.min(quantity, product.stockQuantity || 99),
            selectedColor,
            selectedSize,
            stockQuantity: product.stockQuantity
          }
        ];
      }
    });

    showToast(`Added "${product.title}" to your cart`);
  };

  const updateQuantity = (itemKey, qty) => {
    if (qty <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.itemKey === itemKey) {
          const maxStock = item.stockQuantity || 99;
          return { ...item, quantity: Math.min(qty, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => item.itemKey !== itemKey));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.title}" from saved wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Added "${product.title}" to wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Free shipping threshold: $100
  const freeShippingThreshold = 100;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const standardShippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 9.99;

  let discountAmount = 0;
  if (coupon) {
    if (subtotal >= coupon.minOrderAmount) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
      } else {
        discountAmount = Math.min(subtotal, coupon.discountValue);
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount > 0 ? parseFloat((taxableAmount * 0.0725).toFixed(2)) : 0;
  const totalAmount = parseFloat((taxableAmount + standardShippingFee + taxAmount).toFixed(2));

  const applyCoupon = async (code) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success) {
        setCoupon(res.coupon);
        showToast(`Coupon "${res.coupon.code}" applied!`);
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Invalid coupon', 'error');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discountAmount,
        standardShippingFee,
        taxAmount,
        totalAmount,
        freeShippingThreshold,
        freeShippingProgress,
        freeShippingRemaining,
        coupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
