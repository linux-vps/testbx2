// controllers/refreshController.js

import fetch from 'node-fetch';
import { REFRESH_TOKEN_URL, APP_ID } from '../config/config.js';

export const getRefreshToken = async (req, res) => {
    try {
        const response = await fetch(REFRESH_TOKEN_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch refresh token: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.token) {
            throw new Error('Refresh token is missing in the response');
        }

        res.json({ token: data.token });
    } catch (error) {
        console.error('Error getting refresh token:', error.message);
        res.status(500).json({ error: error.message });
    }
};
