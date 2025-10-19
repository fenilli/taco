import { ErrorRequestHandler } from 'express';
import { HttpError } from '#app/errors/http-error';
import { HttpStatus } from '#constants';

export const errorHandler: ErrorRequestHandler = (
    err,
    _,
    res,
    __
) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json(err.context());
    }

    console.error(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An unexpected server error occurred.'
    });
};
