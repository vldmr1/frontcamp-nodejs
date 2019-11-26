import moment from 'moment';
import fs from 'fs';

const stream = fs.createWriteStream('log.txt', {flags:'a'});

export const logger = (req, res, next) => {
  stream.write(
    `${moment().format()}: ${req.protocol}://${req.get('host')}${
      req.originalUrl
    }\n`
  );
  next();
};