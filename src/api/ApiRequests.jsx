import VerifyPayment from '../pages/customer/VerifyPayment';
import apiInstance from './ApiInstance';

// Auth endpoints
export const authApiRequest = {
  login: (data) => apiInstance.post('/User/login', data),
  googleLogin: (accessToken) => apiInstance.post('/User/login-google', { accessToken }),
  register: (data) => apiInstance.post('/User/register', data),
  forgotPassword: (email) => apiInstance.post('/User/forgot-password', { email }),
  resetPassword: (data) => apiInstance.post('/User/reset-password', data),
  sendVerificationCode: (email) => apiInstance.post('/User/send-verification-code', { email }),
  getUser: (id) => apiInstance.get(`/User/${id}`),
  updateUser: (data) => apiInstance.put(`/User`, data),
  logoutUser: (token) => apiInstance.post('/User/logout', token),
};

export const userApiRequest = {
  getAllCustomers: (offSet, limit) => apiInstance.get(`/User/all-customers?offSet=${offSet}&limit=${limit}`),
};
// Product endpoints
export const productApiRequest = {
  getAllProducts: (params) => apiInstance.get('/products', { params }),
  getAllWithVariants: () => apiInstance.get('/Product/with-variants'),
  getProductById: (id) => apiInstance.get(`/products/${id}`),
  createProduct: (data) => apiInstance.post('/products', data),
  updateProduct: (id, data) => apiInstance.put(`/products/${id}`, data),
  deleteProduct: (id) => apiInstance.delete(`/products/${id}`),
};

export const goodReceivedNoteApiRequest = {
  getAllGoodReceivedNotes: () => apiInstance.get('/GoodReceivedNote'),
  getById: (id) => apiInstance.get(`/GoodReceivedNote/${id}`),
  createGoodReceivedNote: (data) => apiInstance.post('/GoodReceivedNote', data),
  updateGoodReceivedNote: (data) => apiInstance.put(`/GoodReceivedNote`, data),
  deleteGoodReceivedNote: (id) => apiInstance.delete(`/GoodReceivedNote/${id}`),
};

// Category endpoints
export const categoryApiRequest = {
  getAllCategories: () => apiInstance.get('/Category'),
  getCategoryById: (id) => apiInstance.get(`/Category/${id}`),
  createCategory: (data) => apiInstance.post('/Category', data),
  updateCategory: (id, data) => apiInstance.put(`/Category/${id}`, data),
  deleteCategory: (id) => apiInstance.delete(`/Category/${id}`),
};

// Inventory endpoints
export const inventoryApiRequest = {
  getInventory: (params) => apiInstance.get('/inventory', { params }),
  addGoodReceivedNote: (data) => apiInstance.post('/inventory/grn', data),
  updateInventoryItem: (id, data) => apiInstance.put(`/inventory/${id}`, data),
};

// Order endpoints
export const orderApiRequest = {
  getAllOrders: (pageNumber, pageSize, search) => apiInstance.get(`/Order?offSet=${pageNumber}&limit=${pageSize}&searchString=${encodeURIComponent(search)}`),
  getOrderById: (id) => apiInstance.get(`/Order/${id}`),
  getOrdersByUserId: (userId, offSet, limit) => apiInstance.get(`/Order/user/${userId}?offSet=${offSet}&limit=${limit}`),
  getOrdersByUserIdAndStatus: (userId, status, offSet, limit) => apiInstance.get(`/Order/user-and-status/${userId}?status=${status}&offSet=${offSet}&limit=${limit}`),
  createOrder: (data, returnUrl) => {
    return apiInstance.post(`/Order/create?returnUrl=${returnUrl}`, data);
  },
  updateOrderStatus: (id, status) => apiInstance.put(`/Order/update-status/${id}`,  status),
};

// Product attribute endpoints
export const attributeApiRequest = {
  getAllAttributes: () => apiInstance.get('/attributes'),
  createAttribute: (data) => apiInstance.post('/attributes', data),
  updateAttribute: (id, data) => apiInstance.put(`/attributes/${id}`, data),
  deleteAttribute: (id) => apiInstance.delete(`/attributes/${id}`),
};

// Promotion endpoints
export const promotionApiRequest = {
  getAllPromotions: ({ page = 1, pageSize = 10, search = '' } = {}) => {
    const offset = (page - 1) * pageSize;
    let url = `/Promotion?offset=${offset}&limit=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return apiInstance.get(url);
  },
  getPromotionById: (id) => apiInstance.get(`/promotion/${id}`),
  getUsablePromotionsByUserId: (userId) => apiInstance.get(`/Promotion/usable/${userId}`),
  createPromotion: (data) => apiInstance.post('/Promotion', data),
  updatePromotion: (id, data) => apiInstance.put(`/Promotion/${id}`, data),
  deletePromotion: (id) => apiInstance.delete(`/Promotion/${id}`),
};

// Banner endpoints
export const bannerApiRequest = {
  getAllBanners: () => apiInstance.get('/banners'),
  createBanner: (data) => apiInstance.post('/banners', data),
  updateBanner: (id, data) => apiInstance.put(`/banners/${id}`, data),
  deleteBanner: (id) => apiInstance.delete(`/banners/${id}`),
};

// Cart endpoints
export const cartApiRequest = {
  getCart: () => apiInstance.get('/cart'),
  addToCart: (data) => apiInstance.post('/cart/items', data),
  updateCartItem: (id, data) => apiInstance.put(`/cart/items/${id}`, data),
  removeCartItem: (id) => apiInstance.delete(`/cart/items/${id}`),
  clearCart: () => apiInstance.delete('/cart'),
};

export const AttributeApiRequest = {
  getAllAttributes: () => apiInstance.get('/Attribute'),
  getAllWithCategoryAttributes: () => apiInstance.get(`/Attribute/with-category-attributes`),
  getAllWithAttributeValues: () => apiInstance.get(`/Attribute/with-attribute-values`),
  getWithAttributeValuesByCategoryId: (categoryId) => apiInstance.get(`/Attribute/with-attribute-values-by-category/${categoryId}`),
  createAttribute: (data) => apiInstance.post('/Attribute', data),
  updateAttribute: (data) => apiInstance.put(`/Attribute/`, data),
  deleteAttribute: (id) => apiInstance.delete(`/Attribute/${id}`),
};

export const CategoryApiRequest = {
  getAllCategories: () => apiInstance.get('/Category'),
  getBySlug: (slug) => apiInstance.get(`/Category/get-by-slug/${slug}`),
  getAllWithParentAndAttributes: () => apiInstance.get('/Category/with-parent-and-attributes'),
  getAllWithAttributesAndAttributeValues: () => apiInstance.get('/Category/with-attributes-and-attribute-values'),
  createCategory: (data) => apiInstance.post('/Category', data),
  updateCategory: (data) => apiInstance.put(`/Category`, data),
  deleteCategory: (id) => apiInstance.delete(`/Category/${id}`),
};

export const UploadApiRequest = {
  uploadImage: (data) => apiInstance.post('/FirebaseStorage/upload-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateImage: (file, imageUrl) => apiInstance.put(`/FirebaseStorage/update-image?imageUrl=${imageUrl}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (imageUrl) => apiInstance.delete(`/FirebaseStorage/delete-image?imageUrl=${imageUrl}`),
};

export const PlacementApiRequest = {
  getAllPlacements: () => apiInstance.get('/Placement'),
  createPlacement: (data) => apiInstance.post('/Placement', data),
  updatePlacement: (data) => apiInstance.put(`/Placement`, data),
  deletePlacement: (id) => apiInstance.delete(`/Placement/${id}`),
};

export const ProductApiRequest = {
  getAllProducts: (offSet = 0, limit = 10) => apiInstance.get(`/Product?offSet=${offSet}&limit=${limit}`),
  getTopSaleProducts: (count) => apiInstance.get(`/Product/top-sales?count=${count}`),
  getProductsByCategoryId: (id, offSet = 0, limit = 10) => apiInstance.get(`/Product/get-by-category/${id}?offSet=${offSet}&limit=${limit}`),
  getProductById: (id) => apiInstance.get(`/Product/${id}`),
  createProduct: (data) => apiInstance.post('/Product', data),
  updateProduct: (data) => apiInstance.put(`/Product`, data),
  deleteProduct: (id) => apiInstance.delete(`/Product/${id}`),
};

export const VariantApiRequest = {
  getAllVariants: () => apiInstance.get('/Variant'),
  getVariantsByProductId: (productId) => apiInstance.get(`/Variant/get-by-product/${productId}`),
  createVariant: (data) => apiInstance.post('/Variant', data),
  updateVariant: (data) => apiInstance.put(`/Variant`, data),
  deleteVariant: (id) => apiInstance.delete(`/Variant/${id}`),
};

export const shippingApiRequest = {
  calculateShippingCost: (data) => apiInstance.post('/Shipping/calculate-shipping-cost', data),
  getCities: () => apiInstance.get('/Shipping/get-cities'),
  getDistrictsByCityId: (cityId) => apiInstance.get(`/Shipping/get-districts/${cityId}`),
  getWardsByDistrictId: (districtId) => apiInstance.get(`/Shipping/get-wards/${districtId}`),
  getFormattedAddress: (id) => apiInstance.get(`/Shipping/get-formatted-address/${id}`),
};

export const paymentApiRequest = {
  getPaymentLinkInformation: (orderId) => apiInstance.get(`/Payment/get-payment-link-information/${orderId}`),
  verifyPayment: (data) => apiInstance.post('/Payment/verify-payment', data),
};

export const reviewApiRequest = {
  getAllReviews: (pageNumber, pageSize, search) => apiInstance.get(`/Review?offSet=${pageNumber}&limit=${pageSize}&searchString=${encodeURIComponent(search)}`),
  getReviewById: (id) => apiInstance.get(`/Review/${id}`),
  getReviewsByProductId: (productId, page, pageSize) => apiInstance.get(`/Review/product/${productId}?page=${page}&pageSize=${pageSize}`),
  createReview: (data) => apiInstance.post('/Review', data),
  updateReview: (id, data) => apiInstance.put(`/Review/${id}`, data),
  deleteReview: (id) => apiInstance.delete(`/Review/${id}`),
};
