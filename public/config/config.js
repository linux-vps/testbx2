import dotenv from 'dotenv';

dotenv.config();

export const API_URL = process.env.BACKEND_SERVER_URL;
export const PORT = process.env.PORT || 5001;

if (!API_URL) {
    throw new Error('Missing required environment variables');
}