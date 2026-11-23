import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import {
  X,
  Shield,
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose, onRefreshCatalog }) {
  if (!isOpen) return null;

  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'analytics'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    category: 'Electronics',
    price: '',
    originalPrice: '',
    stockQuantity: '20',
    badge: 'New',
    shortDescription: '',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminOrders(),
        api.getProducts()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.analytics);
      if (ordersRes.success) setOrders(ordersRes.orders);
      if (productsRes.success) setProducts(productsRes.products);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to fetch admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order status updated to "${newStatus}"`);
        setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this piece from catalog?')) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast('Product removed from inventory');
        setProducts(prev => prev.filter(p => p.id !== id));
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createProduct(newProd);
      if (res.success) {
        showToast('New product added to catalog!');
        setShowAddProduct(false);
        setNewProd({
          title: '',
          category: 'Electronics',
          price: '',
          originalPrice: '',
          stockQuantity: '20',
          badge: 'New',
          shortDescription: '',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
        });
        fetchData();
        if (onRefreshCatalog) onRefreshCatalog();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-zinc-200 flex flex-col relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-700 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 tracking-tight">
                NIKK AURA Store Administration & Inventory
              </h2>
              <p className="text-xs text-zinc-500">Live operational command center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          
          {/* KPI Metrics */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold mb-1">
                  <span>Gross Sales</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-zinc-900">
                  ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Simulated revenue</div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold mb-1">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-zinc-900">
                  {analytics.totalOrders}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Processed purchases</div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold mb-1">
                  <span>Active Catalog</span>
                  <Package className="w-4 h-4 text-zinc-700" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-zinc-900">
                  {analytics.totalProducts}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Curated SKU items</div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold mb-1">
                  <span>Stock Alerts</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-600">
                  {analytics.lowStockCount}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">&lt;15 units left</div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <div className="flex items-center gap-2">
              {[
                { id: 'orders', label: `Manage Orders (${orders.length})` },
                { id: 'products', label: `Catalog & Inventory (${products.length})` },
                { id: 'analytics', label: 'Revenue Breakdown' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'products' && (
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-semibold text-[10px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-zinc-900">{order.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-zinc-900">{order.customerName}</div>
                        <div className="text-[10px] text-zinc-400">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-3 text-zinc-600">
                        {order.items?.length || 0} pieces
                      </td>
                      <td className="py-3 px-3 font-bold text-zinc-900">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                          order.status === 'processing' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs bg-white border border-zinc-200 rounded-lg p-1.5 focus:outline-none font-semibold cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Add Product Modal Overlay */}
              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-900">Add New Luxury Piece</h4>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="text-zinc-400 hover:text-zinc-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aura Studio Noise-Cancelling Headphones"
                        value={newProd.title}
                        onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Category</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Living">Living</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="24900"
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Original Price (₹ optional)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="28900"
                        value={newProd.originalPrice}
                        onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Stock Units</label>
                      <input
                        type="number"
                        required
                        value={newProd.stockQuantity}
                        onChange={(e) => setNewProd({ ...newProd, stockQuantity: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-600 font-semibold mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={newProd.badge}
                        onChange={(e) => setNewProd({ ...newProd, badge: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-600 font-semibold mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProd.image}
                        onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-600 font-semibold mb-1">Short Description</label>
                      <input
                        type="text"
                        value={newProd.shortDescription}
                        onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                        className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Publish Product
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase font-semibold text-[10px]">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock Units</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-zinc-50/80">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-zinc-100 border border-zinc-200 shrink-0" />
                            <div className="truncate max-w-xs font-bold text-zinc-900">{prod.title}</div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-600">{prod.category}</td>
                        <td className="py-3 px-3 font-bold text-zinc-900">₹{prod.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stockQuantity < 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {prod.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-3 px-3 text-zinc-700">★ {prod.rating}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-4">
                  Category Revenue Performance
                </h4>
                <div className="space-y-3 text-xs">
                  {Object.entries(analytics.categorySales || {}).map(([cat, rev]) => {
                    const percent = analytics.totalRevenue > 0
                      ? Math.round((rev / analytics.totalRevenue) * 100)
                      : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{cat}</span>
                          <span>₹{rev.toLocaleString('en-IN')} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
