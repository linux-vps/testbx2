// routes/index.js

import express from 'express';
import { getEmployeeList } from '../controllers/employeeController.js';
import { contactByID, contactList, contactAdd } from '../controllers/contactController.js';

const router = express.Router();

// Sử dụng .route() để gắn cả GET và POST vào cùng một route
router.route('/user.get')
    .get(getEmployeeList)    
    .post(getEmployeeList);  

router.route('/crm.contact.get')
        .get(contactByID)
        .post(contactByID);

router.route('/crm.contact.list')
    .get(contactList)
    .post(contactList);
    
router.post('/crm.contact.add', contactAdd);

export default router;
