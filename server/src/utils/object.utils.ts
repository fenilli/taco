export const omit = <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const newObj = { ...obj };

    for (const key of keys) {
        delete newObj[key];
    }

    return newObj as Omit<T, K>;
};
