const appUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173/#';

export const URLS = {
    // Base URL
    APP_URL: appUrl,
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
        PRODUCT_EDIT: (id) => `/admin/products/${id}`,
        ORDERS: '/admin/orders',
        CUSTOMERS: '/admin/customers',
        CATEGORIES: '/admin/categories',
        PROFILE: '/admin/profile',
        SETTINGS: '/admin/settings',
        INVENTORY: '/admin/inventory',
        ADD_GOOD_RECEIVED_NOTE: '/admin/inventory/add-good-received-note',
        EDIT_GOOD_RECEIVED_NOTE: (id) => `/admin/inventory/edit-good-received-note/${id}`,
        CUSTOMER: '/admin/customers',
        PROMOTIONS: '/admin/promotions',
        PROFILE: '/admin/profile',
    },

    // Customer routes 
    CUSTOMER: {
        HOME: '/',
        PRODUCTS: '/products',
        PRODUCT_DETAIL: (id) => `/product/${id}`,
        CATEGORIES: '/categories',
        CATEGORY_DETAIL: (slug, parentSlug) =>
            parentSlug
                ? `/category/${parentSlug}/${slug}`
                : `/category/${slug}`,
        CART: '/cart',
        CHECKOUT: '/checkout',
        ORDERS: '/orders',
        PROFILE: '/profile',
        ABOUT: '/about',
        CONTACT: '/contact',
        INTERIOR_DESIGN: '/interior-design',
        VERIFY_PAYMENT: '/verify-payment',
    }
};

