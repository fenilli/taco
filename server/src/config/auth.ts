export default {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret',
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh-secret',
};