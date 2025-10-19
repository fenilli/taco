import { HttpStatus } from '#constants';

export abstract class HttpError extends Error {
    constructor(message: string, public status: HttpStatus) {
        super(message);
    }

    abstract context(): Record<string, any>;
}
