export const config = {
    writeKey: process.env.WRITE_KEY || '',
    port: Number.parseInt(process.env.PORT || "3000"),
    sheerIdApiUrl: process.env.SHEERID_API_URL || '',
    sheerIdToken: process.env.SHEERID_TOKEN || '',
};
