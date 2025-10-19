export const ObjectUtils = {
    omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
        const newObj = { ...obj };
        keys.forEach((k) => delete newObj[k]);
        return newObj;
    },

    pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
        const newObj = {} as Pick<T, K>;
        keys.forEach((k) => {
            if (k in obj) newObj[k] = obj[k];
        });
        return newObj;
    },
};
