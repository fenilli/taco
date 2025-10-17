import { ZodError } from 'zod';
import { ErrorRequestHandler } from 'express';

import { HttpStatus } from '#/constants';
import { HttpError } from '#/errors/http.error';
import { AppError } from '#/errors/app.error';

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

        return res.status(HttpStatus.BadRequest).json({ message: 'Validation Error.', errors });
    }

    if (err instanceof HttpError) {
        return res.status(err.httpStatusCode).json({
            message: err.message
        });
    }

    if (err instanceof AppError) {
        return res.status(err.httpStatusCode).json({
            message: err.message,
            erroCode: err.appErrorCode,
        });
    }

    console.error(err);

    return res.status(HttpStatus.InternalServerError).json({
        message: 'An unexpected server error occurred.'
    });
};
