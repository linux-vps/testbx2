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

export const getData = async (req, res) => {
    const payload = {
        halt: 0,
        cmd: {
          contact: 'crm.contact.list?select[]=ID&select[]=LAST_NAME&select[]=NAME&select[]=ADDRESS&select[]=ADDRESS_2&select[]=ADDRESS_CITY&select[]=ADDRESS_PROVINCE&select[]=PHONE&select[]=EMAIL&select[]=WEB',
          bankdetail: 'crm.requisite.bankdetail.list?filter[NAME]=Bank-details&select[]=ID&select[]=NAME&select[]=RQ_BANK_NAME&select[]=RQ_ACC_NUM&select[]=ORIGINATOR_ID&'
        }
    }
    try {
        const response = await callMethod('batch',payload); 
        
        const data = await response.json();
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }

        const contacts = data.result.result.contact;
        const bankDetails = data.result.result.bankdetail;
        
        const contactAndBanking = contacts.map(contact => {
            const bankDetail = bankDetails.find(bank => bank.ORIGINATOR_ID === contact.ID);

            return {
                ID: contact.ID,
                NAME: `${contact.NAME} ${contact.LAST_NAME}`,
                ADDRESS: contact.ADDRESS,
                ADDRESS_2: contact.ADDRESS_2,
                ADDRESS_CITY: contact.ADDRESS_CITY,
                ADDRESS_PROVINCE: contact.ADDRESS_PROVINCE,
                PHONE: contact.PHONE[0] ? contact.PHONE[0].VALUE : "",
                EMAIL: contact.EMAIL[0] ? contact.EMAIL[0].VALUE : "",
                WEB: contact.WEB[0] ? contact.WEB[0].VALUE : "",
                RQ_BANK_NAME: bankDetail ? bankDetail.RQ_BANK_NAME : "",
                RQ_ACC_NUM: bankDetail ? bankDetail.RQ_ACC_NUM : ""
            };
        });


        return res.json(contactAndBanking);
    } catch (error) {
        return handleError(res, `Lỗi lấy danh sách thông tin: ${error.message}`);
    }
};