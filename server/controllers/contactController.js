
// controllers/contactController.js

import { json } from 'express';
import callMethod from '../utils/BX24.js';

const handleError = (res, error, status = 500, statusText = 'Internal server') => {
    // console.error(error);
    if (status == 400 && statusText =='Bad Request' && error.error_description=='Not found'){
        return res.status(status).json({ 
            error: error.error_description,
            error_description: error.error_description, 
            message: 'Thông tin không tồn tại' });
    }
    if (status == 401 && statusText =='Unauthorized'){
        if(error.error=='invalid_token' && error.error_description=='Unable to get application by token'){
            return res.status(status).json({ 
                error: error.error_description,
                error_description: error.error_description, 
                message: 'Token không hợp lệ, có thể là do refresh token đã hết hạn' });
        }
        if(error.error=='expired_token' && error.error_description=='The access token provided has expired.'){
            return res.status(status).json({ 
                error: error.error_description,
                error_description: error.error_description, 
                message: 'Token đã hết hạn, vui lòng refresh và sử dụng token mới' });
        }    
    }
    return res.status(status).json({ 
        status: status, 
        statusText: statusText, 
        error: error, 
        error_description: 'Lỗi xử lý thông tin liên hệ', 
        message: 'Báo cáo lỗi này cho lập trình viên' });
};

export const contactList = async (req, res) => {
    try {
        const response = await callMethod('crm.contact.list'); // lấy danh sách
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi lấy danh sách liên hệ: ${error.message}`);
    }
};

export const contactByID = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'Thiếu id trong yêu cầu' });
    }

    try {
        const response = await callMethod('crm.contact.get', { ID: id });
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi lấy contact by ID: ${error.message}`);
    }
};

export const contactDeleteByID = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'Thiếu id trong yêu cầu' });
    }

    try {
        const response = await callMethod('crm.contact.delete', { ID: id });
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi xoá contact by ID: ${error.message}`);
    }
};

export const contactAdd = async (req, res) => {
    try {
        const contactData = req.body;

        if (!contactData.fields || Object.keys(contactData.fields).length === 0) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }

        const response = await callMethod('crm.contact.add', contactData);

        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi thêm liên hệ: ${error.message}`);
    }
};

export const contactUpdate = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'Thiếu id trong yêu cầu' });
    }

    try {
        const contactData = req.body;

        if (!contactData.fields || Object.keys(contactData.fields).length === 0) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }

        contactData.ID = id;
        console.log(contactData);
        const response = await callMethod('crm.contact.update', contactData);
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi update contact by ID: ${error.message}`);
    }
};
