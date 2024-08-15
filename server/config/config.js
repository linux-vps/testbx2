// config/config.js
import dotenv from 'dotenv';

dotenv.config();

export const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL;
export const FIELD_USER_GET_URL = process.env.FIELD_USER_GET_URL;
export const APP_ID = process.env.APP_ID;
export const PORT = process.env.PORT || 5000;

if (!REFRESH_TOKEN_URL || !FIELD_USER_GET_URL || !APP_ID) {
    throw new Error('Missing required environment variables');
}