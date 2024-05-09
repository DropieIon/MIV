import { NextFunction, Request, Response } from 'express';
import { BackendError } from '../errors/BackendError.error';

export function errorHandler(err: Error, req: Request,
    res: Response, next: NextFunction) {
        if(err instanceof BackendError) {
            const { statusCode, errors, logging } = err;
            if(logging) {
              console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.errors,
                stack: err.stack,
              }, null, 2));
            }
            return res.status(statusCode).send({ message: errors[0].message });
          }
        
          // Unhandled errors
          console.error(JSON.stringify(err, null, 2));
          return res.status(500).send({ errors: [{ message: "Something went wrong" }] });

    return;
}