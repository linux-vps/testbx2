import fetch from 'node-fetch';
import { getRefreshToken, getStoredRefreshToken } from '../services/authService.js';
import { BITRIX24_DOMAIN } from '../config/config.js';

/**
 * Bitrix24 REST API.
 * @param {String} method - ví dụ: 'user.get'
 * @param {Object} params - Đối tượng 
 * @returns {Promise<Object>} - promise
 */

async function callMethod(action, payload = {}) {
    let url = `https://${BITRIX24_DOMAIN}/rest/${action}.json`;

    let token = getStoredRefreshToken();
    url = new URL(url);
    url.searchParams.append('auth', token);
    // Lấy ra 'params' từ 'payload' nếu tồn tại
    const params = payload.params || {};
    delete payload.params; 
    console.log(payload);
    const addParams = new URLSearchParams(params).toString();
    url = url+"&"+addParams;
    console.log("Url: \n"+url);
    try {
        // call API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok && response.status === 401) {
            // token hết hạn
            token = await getRefreshToken();
            url.searchParams.set('auth', token);
            // call API again
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};

export default callMethod;