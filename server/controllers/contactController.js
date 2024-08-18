
// controllers/contactController.js

import { json } from 'express';
import callMethod from '../utils/BX24.js';

const handleError = (res, message, statusCode = 500) => {
    console.error(message);
    res.status(statusCode).json({ error: message, message: 'Lỗi ở contactController.js' });
};

export const contactList = async (req, res) => {
    try {
        const data = await callMethod('crm.contact.list');
        res.json(data);
    } catch (error) {
        handleError(res, `Lỗi lấy contact list: ${error.message}`);
    }
};

export const contactByID = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'Thiếu id trong yêu cầu' });
    }

    try {
        const data = await callMethod('crm.contact.get', { ID: id });
        if (data.error) {
            return res.status(404).json({ error: data.error });
        }
        res.json(data);
    } catch (error) {
        handleError(res, `Lỗi lấy contact by ID: ${error.message}`);
    }
};

export const contactDeleteByID = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'Thiếu id trong yêu cầu' });
    }

    try {
        const data = await callMethod('crm.contact.delete', { ID: id });
        if (data.error) {
            return res.status(404).json({ error: data.error });
        }
        res.json(data);
    } catch (error) {
        handleError(res, `Lỗi xóa contact by ID: ${error.message}`);
    }
};

export const contactAdd = async (req, res) => {
    try {
        const contactData = req.body;

        if (!contactData.fields || Object.keys(contactData.fields).length === 0) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }

        const data = await callMethod('crm.contact.add', contactData);

        if (data.error) {
            return res.status(400).json({ error: data.error, message: 'Lỗi khi thêm liên hệ' });
        }

        res.json({ success: true, result: data.result });
    } catch (error) {
        handleError(res, `Lỗi thêm liên hệ: ${error.message}`);
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
        const data = await callMethod('crm.contact.update', contactData);
        if (data.error) {
            return res.status(400).json({ error: data.error, message: 'Lỗi khi cập nhật liên hệ' });
        }

        res.json({ success: true, result: data.result });
    } catch (error) {
        handleError(res, `Lỗi cập nhật liên hệ: ${error.message}`);
    }
};
