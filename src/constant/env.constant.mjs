import { configDotenv } from 'dotenv';

configDotenv();

const env_Constant = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URL || 'mongodb://localhost:27017/eduvanta',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_ednora_jwt_token_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || '7',
  GMAIL_User: process.env.GMAIL_User || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.growrichmindset.in',
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ||
    'https://www.growrichmindset.in,http://localhost:1420,tauri://localhost,http://tauri.localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_URL: process.env.REDIS_URL || '',
  GMAIL_Password: process.env.GMAIL_Password || '',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123',
};

export default Object.freeze(env_Constant);
