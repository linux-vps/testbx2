// routes/index.js

import express from 'express';
import { getRefreshToken } from '../services/authService.js';
import { getEmployeeList } from '../controllers/employeeController.js';

const router = express.Router();

// router.get('/refresh-token', getRefreshToken);
router.get('/employees', getEmployeeList);

export default router;
