/* eslint-disable global-require, import/no-dynamic-require */

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8082,
  knex: {} // we assign this from knex file later
};

// Add knex config to main config object under knex key
Object.assign(config.knex, require('../../../knexfile')[config.env]);

export default Object.assign(config, require(`./${config.env}`).default);
