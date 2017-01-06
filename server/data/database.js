import knex from 'knex';
import config from '../config/environment';
import { logger } from '../utils';

const database = knex(config.knex);

if (process.env.NODE_ENV !== 'production') {
  database.on('start', (builder) => {
    const hrstart = process.hrtime();
    builder.on('end', () => {
      const hrend = process.hrtime(hrstart);
      logger.debug(`Query (Execution time (hr): ${hrend[0]}s ${hrend[1] / 1000000}ms)`);
      logger.debug(builder.toString());
    });
  });
}

export default database;
