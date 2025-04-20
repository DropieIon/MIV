import { NextFunction, Request, Response } from 'express';
import { BackendError } from '../errors/BackendError.error';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, req: Request,
    res: Response, next: NextFunction) {
        if(err instanceof BackendError) {
            const { statusCode, errors, logging } = err;
            if(logging) {
              logger.error({
                message: JSON.stringify({
                  code: err.statusCode,
                  errors: err.errors,
                  stack: err.stack,
                }, null, 2),

                labels: {
                  "origin": "middleware"
                }
              });
            }
            return res.status(statusCode).send({ message: errors[0].message });
          }
        
          // Unhandled errors
          logger.error({
            message: JSON.stringify(err, null, 2),
            labels: {
              "origin": "middleware"
            }
          });
          return res.status(500).send({ errors: [{ message: "Something went wrong" }] });

    return;
}