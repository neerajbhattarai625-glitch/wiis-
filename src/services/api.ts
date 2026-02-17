import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const marketplace = {
    getProducts: () => api.get('/marketplace/products'),
    placeOrder: (order: { product_id: string; quantity: number }) => api.post('/marketplace/order', order),
};

export const ai = {
    classifyWaste: (formData: FormData) => api.post('/ai/classify-waste', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getInsights: () => api.get('/ai/insights'),
};

export default api;
