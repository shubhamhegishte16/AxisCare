export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'https://axiscare-backend.onrender.com').replace(/\/$/, '');
export const API_URL = (import.meta.env.VITE_API_URL || `${API_ORIGIN}/api`).replace(/\/$/, '');

export const apiUrl = (path = '') => `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const apiOriginUrl = (path = '') => `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;

