const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, '../logs/api.log'),
      level: 'info',
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
