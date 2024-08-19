// server/utils/BX24.js

import fetch from 'node-fetch';
import { getRefreshToken, getStoredRefreshToken } from '../services/authService.js';
import { BITRIX24_DOMAIN } from '../config/config.js';
import { response } from 'express';

/**
 * Bitrix24 REST API.
 * @param {String} method - ví dụ: 'user.get'
 * @param {Object} params - Đối tượng 
 * @returns {Promise<Object>} - promise
 */

export async function callMethod(action, payload = {}) {
    let url = `https://${BITRIX24_DOMAIN}/rest/${action}.json`;

    let token = await getStoredRefreshToken();
    url = new URL(url);
    url.searchParams.append('auth', token);
    // Lấy ra 'params' từ 'payload' nếu tồn tại
    const params = payload.params || null;
    const id = payload.ID || null;
    delete payload.params;
    delete payload.id;

    try {
        // call API
        let response = await callApi(url, payload, id, params);
        // console.log(response)
        if (response.status === 401 && response.statusText==='Unauthorized') {
            console.log("Renew token");
            // token hết hạn
            token = await getRefreshToken();
            url.searchParams.set('auth', token);
            // url.searchParams.append('auth', token);
            
            // call API again
            response = await callApi(url, payload, id, params);
        }
        if (!response.ok) {
            const error = new Error(`Lỗi HTTP! status: ${response.status}`);
            error.response = response;
            throw error;
        }        

        // const result = await response.json();
        const result = await response;
        return result;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};

/**
 * Bitrix24 REST API - batch method.
 * @param {Object} payload - Đối tượng chứa các lệnh batch
 * @returns {Promise<Object>} - promise
 */

/**
    example payload:
    {
        'halt': 0,
        'cmd': {
            'user': 'user.get?ID=1',
            'first_lead': 'crm.lead.add?fields[TITLE]=Test Title',
            'user_by_name': 'user.search?NAME=Test2',
            'user_lead': 'crm.lead.add?fields[TITLE]=Test Assigned&fields[ASSIGNED_BY_ID]=$result[user_by_name][0][ID]',
        }
    }
*/
export async function callBatch(payload = {}) {
    let url = `https://${BITRIX24_DOMAIN}/rest/batch.json`;

    let token = await getStoredRefreshToken();
    url = new URL(url);
    url.searchParams.append('auth', token);

    try {
        // call API
        let response = await callApi(url=url, payload=payload);
        // console.log(response)
        if (response.status === 401 && response.statusText === 'Unauthorized') {
            console.log("Renew token");
            // token hết hạn
            token = await getRefreshToken();
            url.searchParams.set('auth', token);

            // call API again
            response = await callApi(url=url, payload=payload);
        }
        if (!response.ok) {
            const error = new Error(`Lỗi HTTP! status: ${response.status}`);
            error.response = response;
            throw error;
        }

        // const result = await response.json();
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
}

async function callApi(url, payload, id, params){
    let addParams = "";
    let addId = "";
    if (params!=null){
        addParams = new URLSearchParams(params).toString();
    }
    if (id!=null){
        addId = `id=${id}`
    }
    let finalUrl = `${url}&${addId}&${addParams}`;
    console.log(finalUrl);
    const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return response;
}

// ddang lam do phan callbatch