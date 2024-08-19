import { callBatch, callMethod } from "../utils/BX24.js";

const handleError = (res, error, status = 500, statusText = 'Internal server') => {
    console.error('Error:', error); 
    return res.status(status).json({ 
        status: status, 
        statusText: statusText, 
        error: error, 
        error_description: 'Lỗi xử lý test controller', 
        message: 'Báo cáo lỗi này cho lập trình viên' });
};

export const testController = async (req, res) =>{
    const payload = req.body;
    try {
        const response = await callBatch(payload);
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi lấy contact by ID: ${error.message}`);
    }
}