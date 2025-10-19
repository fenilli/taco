import z from 'zod';
import { ValidationError } from '#app/errors/validation-error';

export const schema = <T extends z.ZodType>(schema: T): T =>
    new Proxy(schema, {
        get(target, prop, receiver) {
            if (prop === 'parse') {
                return (data: Parameters<T['parse']>) => {
                    try {
                        return target.parse(data);
                    } catch (err) {
                        if (err instanceof z.ZodError)
                            throw new ValidationError(err.issues);

                        throw err;
                    }
                };
            }

            if (prop === 'parseAsync') {
                return (data: Parameters<T['parse']>) => {
                    try {
                        return target.parse(data);
                    } catch (err) {
                        if (err instanceof z.ZodError)
                            throw new ValidationError(err.issues);

                        throw err;
                    }
                };
            }

            return Reflect.get(target, prop, receiver);
        }
    });
