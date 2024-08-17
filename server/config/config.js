// config/config.js
import dotenv from 'dotenv';

dotenv.config();
// config từ file .env
export const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL;
export const TOKEN_STORAGE_FILE = process.env.TOKEN_STORAGE_FILE;
export const BITRIX24_DOMAIN = process.env.BITRIX24_DOMAIN;
export const APP_ID = process.env.APP_ID;
export const PORT = process.env.PORT || 5000;


if (!REFRESH_TOKEN_URL || !BITRIX24_DOMAIN || !APP_ID || !TOKEN_STORAGE_FILE) {
    throw new Error('Missing required environment variables');
}

// else

