import winston, { format, transports } from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: format.json(),
  transports: [new transports.Console()],
});
