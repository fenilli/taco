export function env(key: string, fallback: string): string;
export function env(key: string, fallback: number): number;
export function env(key: string, fallback: boolean): boolean;
export function env(key: string): string | undefined;

export function env(key: string, fallback?: string | number | boolean) {
    const value = process.env[key];

    if (value !== undefined) {
        if (typeof fallback === 'number') {
            const numValue = Number(value);

            return isNaN(numValue) ? fallback : numValue;
        }

        if (typeof fallback === 'boolean') {
            const lcValue = value.toLowerCase();
            if (lcValue === 'true' || lcValue === '1') return true;
            if (lcValue === 'false' || lcValue === '0') return false;

            return fallback;
        }

        return value;
    }

    return fallback;
};