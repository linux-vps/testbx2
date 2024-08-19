// services/authService.js

import fetch from 'node-fetch';
import fs from 'fs';
import { REFRESH_TOKEN_URL, TOKEN_STORAGE_FILE } from '../config/config.js';

export const getRefreshToken = async (req, res) => {
    try {
        const response = await fetch(REFRESH_TOKEN_URL);

        if (!response.ok) {
            throw new Error(`Lấy access token thất bại: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.access_token) {
            throw new Error('URl đúng nhưng thiếu access token');
        }
        fs.writeFileSync(TOKEN_STORAGE_FILE, JSON.stringify({ refreshToken: data.access_token }));
        
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error; 
    }
};

export const getStoredRefreshToken = async () => {
    try {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_STORAGE_FILE));
        return tokenData.refreshToken;
    } catch (error) {
        console.error('Error when read access token:', error.message);
        throw error; 
    }
};
