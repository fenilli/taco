export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    InternalServerError = 500,
};

export const isClientError = (status: HttpStatus): boolean =>
    status >= 400 && status < 500;

export const isServerError = (status: HttpStatus): boolean =>
    status >= 500;