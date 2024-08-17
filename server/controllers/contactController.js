// controllers/contactController.js

import apiCall  from '../utils/httpClient.js'; 
import callMethod from '../utils/BX24.js';

export const contactList = async (req, res) => {
    try {
        const data = await callMethod('crm.contact.list');
        res.json(data);
    } catch (error) {
        console.error('Lỗi lấy contact list:', error.message);
        res.status(500).json({ error: error.message, message: "Lỗi ở contactController.js" });
    }
};

export const contactByID = async (req, res) => {
    // const { id } = req.params;
    const id = req.query.id; 
    if (!id) {
        return res.status(400).json({ error: 'ID không được cung cấp' }); 
    }

    try {
        const data = await callMethod('crm.contact.get', { ID: id });
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }
        res.json(data);
    } catch (error) {
        console.error('Lỗi lấy contact by ID:', error.message);
        res.status(500).json({ error: error.message, message: "Lỗi ở contactController.js" });
    }
};

export const contactAdd = async (req, res) => {
    try {
        const contactData = req.body;

        if (!contactData.fields || Object.keys(contactData.fields).length === 0) {
            return res.status(400).json({ error: 'missing fields or data' });
        }

        // Gọi phương thức 'crm.contact.add' với dữ liệu liên hệ
        const data = await callMethod('crm.contact.add', contactData);

        // Kiểm tra xem có lỗi nào không
        if (data.error) {
            return res.status(400).json({ error: data.error, message: 'Lỗi khi thêm liên hệ' });
        }

        // Trả về kết quả thành công
        res.json({ success: true, result: data.result });
    } catch (error) {
        console.error('Lỗi thêm liên hệ:', error.message);
        res.status(500).json({ error: error.message, message: 'Lỗi ở contactController.js' });
    }
};