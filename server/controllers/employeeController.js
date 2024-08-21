// controllers/employeeController.js

import callMethod from '../utils/BX24.js';

export const getEmployeeList = async (req, res) => {
    try {
        const data = await callMethod('user.get');
        return res.json(data);
    } catch (error) {
        console.error('Lỗi lấy employee list:', error.message);
        return res.status(500).json({ error: error.message, message: "Lỗi ở employeeController.js" });
    }
};
