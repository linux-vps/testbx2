import fetch from 'node-fetch';
import { getRefreshToken, getStoredRefreshToken } from '../services/authService.js';

const apiCall = async (url, action = 'get', payload = null, options = {}) => {
    try {
        let token = getStoredRefreshToken();
        let urlWithToken = new URL(url);
        urlWithToken.searchParams.append('auth', token);

        // method và body 
        options.method = action.toUpperCase();
        if (action === 'post' || action === 'put' || action === 'patch') {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(payload);
        }

        let response = await fetch(urlWithToken, options);

        if (!response.ok && response.status === 401) {
            // token hết hạn
            token = await getRefreshToken();
            urlWithToken.searchParams.set('auth', token);
            response = await fetch(urlWithToken, options);
        }

        if (!response.ok) {
            throw new Error(`Lỗi ${action} dữ liệu: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi ${action}:`, error.message);
        throw error;
    }
};

export default apiCall;
