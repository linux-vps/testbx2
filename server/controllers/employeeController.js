// controllers/employeeController.js

import apiCall  from '../utils/httpClient.js'; 
import { FIELD_USER_GET_URL } from '../config/config.js';

export const getEmployeeList = async (req, res) => {
    try {
        const data = await apiCall(FIELD_USER_GET_URL, 'get');
        res.json(data);
    } catch (error) {
        console.error('Lỗi lấy employee list:', error.message);
        res.status(500).json({ error: error.message, message: "Lỗi ở employeeController.js" });
    }
};
