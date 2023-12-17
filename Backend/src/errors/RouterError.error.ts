export type ErrorContent = {
    message: string,
    context?: { [key: string]: any }
};

export abstract class RouterError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errors: ErrorContent[];
    abstract readonly logging: boolean;

    constructor(message: string) {
        super(message);

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RouterError.prototype);
    }
}