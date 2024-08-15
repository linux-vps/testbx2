// controllers/employeeController.js

import fetch from 'node-fetch';
import { APP_ID, FIELD_USER_GET_URL, REFRESH_TOKEN_URL } from '../config/config.js';

export const getEmployeeList = async (req, res) => {
    try {
        const tokenResponse = await fetch(REFRESH_TOKEN_URL);

        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch refresh token: ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();
        if (!tokenData.token) {
            throw new Error('Refresh token is missing in the response');
        }

        const response = await fetch(`${FIELD_USER_GET_URL}?auth=${tokenData.token}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch employee list: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error getting employee list:', error.message);
        res.status(500).json({ error: error.message });
    }
};