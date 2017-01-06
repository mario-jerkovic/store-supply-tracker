import fs from 'fs';
import moment from 'moment-timezone';
import winston from 'winston';
import config from '../config/environment';

const tsFormat = () => moment().format('YYYY-MM-DD HH:mm');

const transports = [
  new (winston.transports.Console)({
    timestamp: tsFormat,
    colorize: true,
    level: config.env === 'development' ? 'debug' : 'info'
  })
];

if (config.env !== 'development') {
  const logDir = './logs/';

  // Create the log directory if it does not exist

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  transports.push(
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: config.env === 'development' ? 'debug' : 'info'
    })
  );
}

const logger = new (winston.Logger)({ transports });

export default logger;
