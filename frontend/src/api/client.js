const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aura_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (name, email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  getMe: () => request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return request(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  addReview: (productId, reviewData) => request(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),

  // Coupons
  validateCoupon: (code, subtotal) => request('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  }),

  // Orders
  createOrder: (orderPayload) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload)
  }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrderById: (id) => request(`/orders/${id}`),

  // Admin
  getAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (orderId, status) => request(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  getAdminAnalytics: () => request('/admin/analytics'),
  createProduct: (productData) => request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id, updates) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  deleteProduct: (id) => request(`/products/${id}`, {
    method: 'DELETE'
  })
};
