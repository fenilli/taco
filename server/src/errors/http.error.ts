import { HttpStatus } from '#/constants';

export class HttpError extends Error {
    constructor(message: string, public httpStatusCode: HttpStatus) {
        super(message);
    }
}
