/* eslint-disable global-require */

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  graphql: {
    port: 8081
  }
};

export default Object.assign(config, require(`./${config.env}`).default);
