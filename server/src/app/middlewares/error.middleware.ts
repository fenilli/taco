import { ZodError } from "zod";
import type { ErrorRequestHandler, RequestHandler } from "express";

import { HttpStatus } from "#utils/constants";
import { AppError } from "#app/errors/app.error";

export const notFoundHandler: RequestHandler = (req, res, _) => {
    return res.status(HttpStatus.NotFound).json({ message: 'Not Found.', error: { path: req.path } });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, _) => {
    if (req.path === '/auth/refresh') res.clearCookie('accessToken').clearCookie('refreshToken', { path: '/auth/refresh' });

    if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));

        return res.status(HttpStatus.BadRequest).json({ message: 'Bad Request.', errors });
    }

    if (error instanceof AppError)
        return res.status(error.statusCode).json({ message: error.message, errorCode: error.errorCode });

    return res.status(HttpStatus.InternalServerError).json({ message: 'Internal Server Error!', error: { path: req.path, name: error.name, message: error.message } });
};