export default {
    env: (process.env.ENV || 'development') as 'development' | 'production',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173/'
};
