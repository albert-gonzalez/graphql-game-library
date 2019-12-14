import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
  logger.level = 'error';
}

export default logger;
