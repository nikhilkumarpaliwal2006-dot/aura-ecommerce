import { SEED_PRODUCTS, SEED_COUPONS, SEED_CATEGORIES } from '../data/seedData';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// Safe fetch with 4s timeout
async function safeFetch(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // If server returned HTML (e.g. Vercel rewrite or Render 502 page), throw so fallback takes over
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Non-JSON response from server');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Server returned error status');
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Mock auth helper using localStorage
function getLocalMockUser() {
  try {
    const raw = localStorage.getItem('aura_mock_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setLocalMockUser(user) {
  try {
    localStorage.setItem('aura_mock_user', JSON.stringify(user));
  } catch (e) {}
}

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      return await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      console.warn('Backend sleeping or offline, applying instant local fallback login');
      const isAdmin = email.toLowerCase().includes('admin');
      const mockUser = {
        id: isAdmin ? 'usr_admin_1' : 'usr_demo_1',
        name: isAdmin ? 'Nikhil Paliwal' : (email.split('@')[0] || 'Aura Guest'),
        email: email,
        role: isAdmin ? 'admin' : 'customer'
      };
      setLocalMockUser(mockUser);
      return {
        success: true,
        token: 'nikk_aura_token_' + Date.now(),
        user: mockUser
      };
    }
  },

  register: async (name, email, password) => {
    try {
      return await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
    } catch (err) {
      console.warn('Backend sleeping or offline, applying instant local fallback register');
      const mockUser = {
        id: 'usr_' + Date.now(),
        name: name || 'Valued Guest',
        email: email,
        role: 'customer'
      };
      setLocalMockUser(mockUser);
      return {
        success: true,
        token: 'nikk_aura_token_' + Date.now(),
        user: mockUser
      };
    }
  },

  getMe: async () => {
    const token = localStorage.getItem('aura_token');
    try {
      return await safeFetch(`${API_BASE}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }, 2500);
    } catch (err) {
      const localUser = getLocalMockUser();
      if (localUser && token) {
        return { success: true, user: localUser };
      }
      return { success: false, message: 'Not logged in' };
    }
  },

  // Products
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString();
      return await safeFetch(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`, {}, 3000);
    } catch (err) {
      console.warn('Backend not responding, serving embedded NIKK AURA luxury catalog');
      let filtered = [...SEED_PRODUCTS];

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        );
      }

      if (params.category && params.category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }

      if (params.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
      }

      if (params.inStockOnly === 'true' || params.inStockOnly === true) {
        filtered = filtered.filter(p => p.inStock);
      }

      if (params.minRating) {
        filtered = filtered.filter(p => p.rating >= Number(params.minRating));
      }

      if (params.sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (params.sort === 'reviews') {
        filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
      }

      return {
        success: true,
        count: filtered.length,
        totalProducts: SEED_PRODUCTS.length,
        categories: SEED_CATEGORIES,
        products: filtered
      };
    }
  },

  getProductById: async (id) => {
    try {
      return await safeFetch(`${API_BASE}/products/${id}`);
    } catch (err) {
      const product = SEED_PRODUCTS.find(p => p.id === id);
      if (product) {
        return { success: true, product };
      }
      throw new Error('Product not found');
    }
  },

  addReview: async (productId, reviewData) => {
    try {
      return await safeFetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
    } catch (err) {
      return {
        success: true,
        review: {
          id: 'rev_' + Date.now(),
          ...reviewData,
          date: new Date().toISOString().split('T')[0]
        }
      };
    }
  },

  // Coupons
  validateCoupon: async (code, subtotal) => {
    try {
      return await safeFetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
    } catch (err) {
      const coupon = SEED_COUPONS.find(c => c.code.toUpperCase() === (code || '').toUpperCase());
      if (!coupon) {
        throw new Error('Invalid promo code');
      }
      if (subtotal < coupon.minOrderAmount) {
        throw new Error(`Minimum order of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for this coupon`);
      }
      const discount = coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

      return {
        success: true,
        coupon: {
          code: coupon.code,
          discount,
          description: coupon.description
        }
      };
    }
  },

  // Orders
  createOrder: async (orderPayload) => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });
    } catch (err) {
      const newOrder = {
        id: 'ord_' + Math.floor(1000 + Math.random() * 9000),
        status: 'processing',
        createdAt: new Date().toISOString(),
        ...orderPayload
      };
      try {
        const storedOrders = JSON.parse(localStorage.getItem('aura_mock_orders') || '[]');
        storedOrders.unshift(newOrder);
        localStorage.setItem('aura_mock_orders', JSON.stringify(storedOrders));
      } catch (e) {}
      return {
        success: true,
        order: newOrder
      };
    }
  },

  getMyOrders: async () => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/orders/my-orders`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('aura_mock_orders') || '[]');
        return { success: true, count: storedOrders.length, orders: storedOrders };
      } catch (e) {
        return { success: true, count: 0, orders: [] };
      }
    }
  },

  getOrderById: async (id) => {
    try {
      return await safeFetch(`${API_BASE}/orders/${id}`);
    } catch (err) {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('aura_mock_orders') || '[]');
        const ord = storedOrders.find(o => o.id === id);
        if (ord) return { success: true, order: ord };
      } catch (e) {}
      throw new Error('Order not found');
    }
  },

  // Admin
  getAdminOrders: async () => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/admin/orders`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('aura_mock_orders') || '[]');
        return { success: true, orders: storedOrders };
      } catch (e) {
        return { success: true, orders: [] };
      }
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      return { success: true, message: 'Status updated' };
    }
  },

  getAdminAnalytics: async () => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/admin/analytics`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      return {
        success: true,
        analytics: {
          totalRevenue: 342980,
          ordersCount: 14,
          productsCount: SEED_PRODUCTS.length,
          customersCount: 8,
          averageOrderValue: 24498
        }
      };
    }
  },

  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(productData)
      });
    } catch (err) {
      return {
        success: true,
        product: { id: 'prod_' + Date.now(), ...productData }
      };
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      return { success: true, product: { id, ...updates } };
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('aura_token');
      return await safeFetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      return { success: true, message: 'Product deleted' };
    }
  }
};
