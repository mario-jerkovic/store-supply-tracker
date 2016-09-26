/* eslint-disable no-console, no-shadow */
import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import webpackConfig from '../webpack.config.babel';
import config from './config/environment';
import schema from './data/schema';
import logger from './utils/logger';

if (config.env === 'development') {
  // Launch GraphQL
  const graphql = express();
  graphql.use('/', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema
  }));
  graphql.listen(config.graphql.port, () => logger.info('GraphQL is listening on port:', {port: config.graphql.port }));

  // Launch Relay by using webpack.config.babel.js
  const relayServer = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    proxy: {
      '/graphql': `http://localhost:${config.graphql.port}`
    },
    stats: {
      // Set assets to true for more detailed build log in console
      // Keep everything else as it is
      assets: false,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: false,
      chunkModules: true
    },
    quiet: false,
    noInfo: false,
    hot: true,
    historyApiFallback: true,
  });

  // Serve static resources
  relayServer.use('/', express.static(path.join(__dirname, '../build')));
  relayServer.listen(config.port, () => logger.info('Relay is listening on port:', { port: config.port }));
} else if (config.env === 'production') {
  const relayServer = express();
  relayServer.use(historyApiFallback());
  relayServer.use('/', express.static(path.join(__dirname, '../build')));
  relayServer.use('/graphql', graphQLHTTP({ schema }));
  relayServer.listen(config.port, () => logger.info('Relay is listening on port:', { port: config.port }));
}
