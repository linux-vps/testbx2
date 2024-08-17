import fetch from 'node-fetch';
import { getRefreshToken, getStoredRefreshToken } from '../services/authService.js';
import { BITRIX24_DOMAIN } from '../config/config.js';

/**
 * Bitrix24 REST API.
 * @param {String} method - ví dụ: 'user.get'
 * @param {Object} params - Đối tượng 
 * @returns {Promise<Object>} - promise
 */

async function callMethod(method, params = {}) {
    let url = `https://${BITRIX24_DOMAIN}/rest/${method}.json`;

    let token = getStoredRefreshToken();
    url = new URL(url);
    url.searchParams.append('auth', token);
    try {

        const queryString = new URLSearchParams(params).toString();

        // call API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded, application/json'
            },
            body: queryString
        });
        if (!response.ok && response.status === 401) {
            // token hết hạn
            token = await getRefreshToken();
            url.searchParams.set('auth', token);
            // call API again
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded, application/json'
                },
                body: queryString
            });
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Phân tích phản hồi từ API
        const result = await response.json();

        // Trả về kết quả
        return result;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
}

export default callMethod;