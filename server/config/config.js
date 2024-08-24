// config/config.js
import dotenv from 'dotenv';

dotenv.config();
// config từ file .env

export const BITRIX24_DOMAIN = process.env.BITRIX24_DOMAIN;
export const APP_SECRET = process.env.APP_SECRET;
export const TOKEN_STORAGE_FILE = process.env.TOKEN_STORAGE_FILE;
export const APP_ID = process.env.APP_ID;
export const CODE = process.env.CODE;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const AUTHORIZATION_SERVER = process.env.AUTHORIZATION_SERVER;
export const PORT = process.env.PORT || 5000;

if (!APP_SECRET || !BITRIX24_DOMAIN || !APP_ID || !TOKEN_STORAGE_FILE) {
    throw new Error('Missing required environment variable');
}

// else
export const REFRESH_TOKEN_URL = `${AUTHORIZATION_SERVER}&client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${CODE}&refresh_token=${REFRESH_TOKEN}`;
// https://oauth.bitrix.info/oauth/token/?grant_type=refresh_token
