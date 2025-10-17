import { ZodError } from 'zod';
import { ErrorRequestHandler } from 'express';

import { HttpStatus } from '#/constants';
import { AppError } from '#/error/http.error';

export const errorHandler: ErrorRequestHandler = (
    err,
    _,
    res,
    __
) => {
    if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));

        return res.status(HttpStatus.UnprocessableEntity).json({ message: 'Validation Error.', errors });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.appErrorCode,
        });
    }

    console.error(err);

    return res.status(HttpStatus.InternalServerError).json({
        message: 'An unexpected server error occurred.'
    });
};
