import z from 'zod';
import { HttpError } from '#app/errors/http-error';
import { HttpStatus } from '#constants';

export class ValidationError extends HttpError {
    public readonly errors: {
        path: string;
        message: string;
    }[];

    constructor(issues: z.core.$ZodIssue[]) {
        super('Validation failed', HttpStatus.BAD_REQUEST);

        this.errors = issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }

    context(): Record<string, any> {
        return {
            message: this.message,
            errors: this.errors,
        };
    }
}
