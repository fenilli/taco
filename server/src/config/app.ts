export default {
    env: (process.env.ENV || 'development') as 'development' | 'production',
    port: parseInt(process.env.PORT || '3000')
};