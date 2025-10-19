export const EnvUtils = {
    get: (key: string, fallback?: string): string => {
        const value = process.env[key];
        if (value !== undefined) return value;
        if (fallback !== undefined) return fallback;

        throw new Error(`Missing environment variable: ${key}`);
    },
};
