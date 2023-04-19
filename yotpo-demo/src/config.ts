import dotenv from 'dotenv';

const config = {
    PORT: process.env.PORT || 3000,
    SHEERID_API_URL: process.env.SHEERID_API_URL,
    SHEERID_TOKEN: process.env.SHEERID_TOKEN,
    YOTPO_API_URL: process.env.YOTPO_API_URL,
    YOTPO_API_KEY: process.env.YOTPO_API_KEY,
    YOTPO_GUID: process.env.YOTPO_GUID,
};

export default config;
