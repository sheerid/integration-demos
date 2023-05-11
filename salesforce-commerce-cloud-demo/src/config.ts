export const config = {
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    orgId: process.env.ORG_ID || '',
    siteNum: process.env.SITE_NUM || '',
    shortCode: process.env.SHORT_CODE || '',
    siteId: process.env.SITE_ID || '',
    port: Number.parseInt(process.env.PORT || "3000"),
    sheerIdApiUrl: process.env.SHEERID_API_URL || '',
    sheerIdToken: process.env.SHEERID_TOKEN || '',
};
