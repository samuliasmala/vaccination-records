const { transports, createLogger, format } = require('winston');
const { combine, timestamp, colorize, printf } = format;

const config = require('../config');

const myFormat = printf(info => {
  let { level, message, timestamp, stack, ...rest } = info;
  message += stack == null ? '' : `\n${info.stack}`;
  return `${timestamp} [${level}]: ${message} ${
    Object.entries(rest).length > 0 ? JSON.stringify(rest) : ''
  }`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.json()),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
logger.add(
  new transports.Console({
    level: config.get('LOG_LEVEL'),
    handleExceptions: true,
    format: combine(timestamp({ format: 'HH:mm:ss' }), colorize(), myFormat)
  })
);

module.exports = logger;
