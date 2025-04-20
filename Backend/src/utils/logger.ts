import winston, { format, transports } from 'winston';

export const logger = winston.createLogger({
  format: format.json(),
  transports: [new transports.Console()],
});
