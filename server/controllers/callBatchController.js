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
        let order = cmdData.order;
        let filter = cmdData.filter;
        let select = cmdData.select;
        let params = cmdData.params;

        // Khởi tạo query string với method
        payload.cmd[key] = `${method}?`;

        // Thêm ID nếu có
        if (id) {
            payload.cmd[key] += `ID=${id}&`;
        }

        // // Thêm fields nếu có
        // if (fields) {
        //     let params = Object.entries(fields)
        //         .map(([fieldKey, fieldValue]) => `fields[${fieldKey}]=${encodeURIComponent(fieldValue)}`)
        //         .join('&');
        //     payload.cmd[key] += `${params}&`;
        // }

        if (fields) {
            let fieldParams = Object.entries(fields)
                .map(([fieldKey, fieldValue]) => {
                    if (Array.isArray(fieldValue)) {
                        // Trường hợp đặc biệt xử lý mảng các đối tượng
                        return fieldValue.map((item, index) => {
                            return Object.entries(item)
                                .map(([subKey, subValue]) => `fields[${fieldKey}][${index}][${subKey}]=${encodeURIComponent(subValue)}`)
                                .join('&');
                        }).join('&');
                    } else {
                        return `fields[${fieldKey}]=${encodeURIComponent(fieldValue)}`;
                    }
                })
                .join('&');
            payload.cmd[key] += `${fieldParams}&`;
        }

        // Thêm order nếu có
        if (order) {
            let params = Object.entries(order)
                .map(([orderKey, orderValue]) => `order[${orderKey}]=${encodeURIComponent(orderValue)}`)
                .join('&');
            payload.cmd[key] += `${params}&`;
        }

        // Thêm filter nếu có
        if (filter) {
            let params = Object.entries(filter)
                .map(([filterKey, filterValue]) => `filter[${filterKey}]=${encodeURIComponent(filterValue)}`)
                .join('&');
            payload.cmd[key] += `${params}&`;
        }

        // Thêm select nếu có
        if (select) {
            let params = select
                .map(item => `select[]=${encodeURIComponent(item)}`)
                .join('&');
            payload.cmd[key] += `${params}&`;
        }

        // Thêm select nếu có
        if (params) {
            let params2 = new URLSearchParams(params).toString();
            payload.cmd[key] += `${params2}&`;
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