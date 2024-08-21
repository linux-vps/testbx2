import  callMethod  from "../utils/BX24.js";

const handleError = (res, error, status = 500, statusText = 'Internal server') => {
    console.error('Error:', error); 
    return res.status(status).json({ 
        status: status, 
        statusText: statusText, 
        error: error, 
        error_description: 'callBatch error', 
        message: 'Báo cáo lỗi này cho lập trình viên' });
};

export const callBatch = async (req, res) =>{
    const body = req.body;
    let payload = {
        halt: body.halt,
        cmd: {}
    };

    for (let key in body.cmd) {
        let cmdData = body.cmd[key];
        let method = cmdData.method;
        let id = cmdData.id;
        let fields = cmdData.fields;

        if (fields) {
            let params = Object.entries(fields)
                .map(([fieldKey, fieldValue]) => `fields[${fieldKey}]=${encodeURIComponent(fieldValue)}`)
                .join('&');
                payload.cmd[key] = `${method}?ID=${id}&${params}`;
        } else {
            payload.cmd[key] = `${method}?id=${id}`;
        }
    }
    console.log(payload);

    try {
        const response = await callMethod('batch',payload);
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }
        return res.json(data);
    } catch (error) {
        return handleError(res, `Lỗi batch: ${error.message}`);
    }
}