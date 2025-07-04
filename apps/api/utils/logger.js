import { createLogger, format, transports } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not defined in ES modules, so define it like this:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default logger;
