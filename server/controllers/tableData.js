import  callMethod  from "../utils/BX24.js";

const handleError = (res, error, status = 500, statusText = 'Internal server') => {
    console.error('Error:', error); 
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
        // console.log(data.result.contact[0]);
        if (!response.ok){
            return handleError(res, data, response.status, response.statusText);
        }

        const contacts = data.result.result.contact;
        const bankDetails = data.result.result.bankdetail;
        const contactAndBanking = contacts.map(contact => {
            const bankDetail = bankDetails.find(bank => bank.ORIGINATOR_ID === contact.ID);
            const addressParts = [
                contact.ADDRESS,
                contact.ADDRESS_2,
                contact.ADDRESS_CITY,
                contact.ADDRESS_PROVINCE
              ];
            // Loại bỏ các giá trị null, undefined, hoặc chuỗi rỗng
            const filteredAddressParts = addressParts.filter(part => part && part.trim() !== "");
            return {
                ID_CONTACT: contact.ID,
                ID_BANK: bankDetail ? bankDetail.ID : "",
                NAME_FULL: `${contact.LAST_NAME ? contact.LAST_NAME : ""} ${contact.NAME ? contact.NAME : ""}`,
                NAME: contact.NAME ? contact.NAME : "",
                LAST_NAME: contact.LAST_NAME ? contact.LAST_NAME : "",
                ADDRESS_FULL: filteredAddressParts.join(", "),
                ADDRESS: contact.ADDRESS ? contact.ADDRESS : "",
                ADDRESS_2: contact.ADDRESS_2 ? contact.ADDRESS_2 : "",
                ADDRESS_CITY: contact.ADDRESS_CITY ? contact.ADDRESS_CITY : "",
                ADDRESS_PROVINCE: contact.ADDRESS_PROVINCE ? contact.ADDRESS_PROVINCE : "",
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

export const addData = async (req, res) => {
    const { lastName, name, ward, district, city, province, phoneNumber, email, website, bankName, accountNumber } = req.body;

    const payload = {
        halt: 0,
        cmd: {
            addContact: `crm.contact.add?fields[LAST_NAME]=${lastName}&fields[NAME]=${name}&fields[ADDRESS]=${ward}&fields[ADDRESS_2]=${district}&fields[ADDRESS_CITY]=${city}&fields[ADDRESS_PROVINCE]=${province}&fields[OPENED]=Y&fields[ASSIGNED_BY_ID]=1&fields[TYPE_ID]=CLIENT&fields[SOURCE_ID]=SELF&fields[EMAIL][0][VALUE_TYPE]=WORK&fields[EMAIL][0][VALUE]=${email}&fields[EMAIL][0][TYPE_ID]=EMAIL&fields[WEB][0][VALUE_TYPE]=WORK&fields[WEB][0][VALUE]=${website}&fields[WEB][0][TYPE_ID]=WEB&fields[PHONE][0][VALUE_TYPE]=WORK&fields[PHONE][0][VALUE]=${phoneNumber}&fields[PHONE][0][TYPE_ID]=PHONE&REGISTER_SONET_EVENT=Y`,
            addRequisite: `crm.requisite.add?fields[RQ_CONTACT]=%24result%5BaddContact%5D&fields[ORIGINATOR_ID]=%24result%5BaddContact%5D&fields[ENTITY_TYPE_ID]=3&fields[ENTITY_ID]=%24result%5BaddContact%5D&fields[PRESET_ID]=1&fields[NAME]=Banking-details&fields[XML_ID]=null&fields[ACTIVE]=Y&fields[SORT]=100`,
            addBankdetail: `crm.requisite.bankdetail.add?fields[RQ_CONTACT]=%24result%5BaddContact%5D&fields[ORIGINATOR_ID]=%24result%5BaddContact%5D&fields[ENTITY_ID]=%24result%5BaddRequisite%5D&fields[NAME]=Bank-details&fields[RQ_BANK_NAME]=${bankName}&fields[RQ_ACC_NUM]=${accountNumber}`
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
        return handleError(res, `Lỗi khi thêm: ${error.message}`);
    }
};

export const updateData = async (req, res) => {
    const {idContact, idBank, lastName, name, ward, district, city, province, phoneNumber, email, website, bankName, accountNumber } = req.body;
    let payload = {};
    if (!idBank){
        payload = {
            halt: 0,
            cmd: {
                updateContact: `crm.contact.update?ID=${idContact}&fields[LAST_NAME]=${lastName}&fields[NAME]=${name}&fields[ADDRESS]=${ward}&fields[ADDRESS_2]=${district}&fields[ADDRESS_CITY]=${city}&fields[ADDRESS_PROVINCE]=${province}&fields[OPENED]=Y&fields[ASSIGNED_BY_ID]=1&fields[TYPE_ID]=CLIENT&fields[SOURCE_ID]=SELF&fields[EMAIL][0][VALUE_TYPE]=WORK&fields[EMAIL][0][VALUE]=${email}&fields[EMAIL][0][TYPE_ID]=EMAIL&fields[WEB][0][VALUE_TYPE]=WORK&fields[WEB][0][VALUE]=${website}&fields[WEB][0][TYPE_ID]=WEB&fields[PHONE][0][VALUE_TYPE]=WORK&fields[PHONE][0][VALUE]=${phoneNumber}&fields[PHONE][0][TYPE_ID]=PHONE`,
                addRequisite: `crm.requisite.add?fields[RQ_CONTACT]=${idContact}&fields[ORIGINATOR_ID]=${idContact}&fields[ENTITY_TYPE_ID]=3&fields[ENTITY_ID]=${idContact}&fields[PRESET_ID]=1&fields[NAME]=Banking-details&fields[XML_ID]=null&fields[ACTIVE]=Y&fields[SORT]=100`,
                addBankdetail: `crm.requisite.bankdetail.add?fields[RQ_CONTACT]=${idContact}&fields[ORIGINATOR_ID]=${idContact}&fields[ENTITY_ID]=%24result%5BaddRequisite%5D&fields[NAME]=Bank-details&fields[RQ_BANK_NAME]=${bankName}&fields[RQ_ACC_NUM]=${accountNumber}`
            }
        }
    } else {
        payload = {
            halt: 0,
            cmd: {
                updateContact: `crm.contact.update?ID=${idContact}&fields[LAST_NAME]=${lastName}&fields[NAME]=${name}&fields[ADDRESS]=${ward}&fields[ADDRESS_2]=${district}&fields[ADDRESS_CITY]=${city}&fields[ADDRESS_PROVINCE]=${province}&fields[OPENED]=Y&fields[ASSIGNED_BY_ID]=1&fields[TYPE_ID]=CLIENT&fields[SOURCE_ID]=SELF&fields[EMAIL][0][VALUE_TYPE]=WORK&fields[EMAIL][0][VALUE]=${email}&fields[EMAIL][0][TYPE_ID]=EMAIL&fields[WEB][0][VALUE_TYPE]=WORK&fields[WEB][0][VALUE]=${website}&fields[WEB][0][TYPE_ID]=WEB&fields[PHONE][0][VALUE_TYPE]=WORK&fields[PHONE][0][VALUE]=${phoneNumber}&fields[PHONE][0][TYPE_ID]=PHONE`,    
                updateBankdetail: `crm.requisite.bankdetail.update?ID=${idBank}&fields[RQ_BANK_NAME]=${bankName}&fields[RQ_ACC_NUM]=${accountNumber}`
            }
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
        return handleError(res, `Lỗi khi sửa: ${error.message}`);
    }
};

export const deleteData = async (req, res) => {
    const { idContact, idBank } = req.body;
    try {
        const requisiteEntity = await callMethod(
            'crm.requisite.list',
            { 
                filter: { ENTITY_ID: idContact },
                select: ['ID'] 
            }
        );

        if (requisiteEntity.length > 0) {
            // Xoá tất cả entity
            await Promise.all(requisiteEntity.map(entity => 
                callMethod(
                    'crm.requisite.delete',
                    { 
                        ID: entity.ID 
                    }
                )));
        }

        const deleteContactResult = await callMethod(
            'crm.contact.delete',
            {
                ID: idContact
            }
        );

        if (deleteContactResult.error) {
            throw new Error(`Không thể xóa liên hệ với id: ${idContact}`);
        }

        return res.json({ success: true, message: "Xóa liên hệ thành công", data: deleteContactResult });
        
    } catch (error) {
        return handleError(res, `Lỗi khi xóa dữ liệu: ${error.message}`);
    }
};
