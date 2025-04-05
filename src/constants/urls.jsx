export const URLS = {
    // Auth routes
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },

    // Admin routes
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        PRODUCTS: '/admin/products',
        ORDERS: '/admin/orders',
        CUSTOMERS: '/admin/customers',
        CATEGORIES: '/admin/categories',
        PROFILE: '/admin/profile',
        SETTINGS: '/admin/settings',
        INVENTORY: '/admin/inventory',
        ADD_GOOD_RECEIVED_NOTE: '/admin/inventory/add-good-received-note',
        CUSTOMER: '/admin/customers',
        PROMOTIONS: '/admin/promotions',
    },

    // Customer routes 
    CUSTOMER: {
        HOME: '/',
        PRODUCTS: '/products',
        PRODUCT_DETAILS: (id) => `/products/${id}`,
        CATEGORIES: '/categories',
        CATEGORIE_DETAILS: (id) => `/categories/${id}`,
        CART: '/cart',
        CHECKOUT: '/checkout',
        ORDERS: '/orders',
        PROFILE: '/profile',
        ABOUT: '/about',
        CONTACT: '/contact'
    }
};

