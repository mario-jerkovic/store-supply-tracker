/* eslint-disable no-console, no-shadow */
import chalk from 'chalk';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import session from 'express-session';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import config from './config/environment';
import schema from './data/schema';
import database from './data/database';
import {
  getSessionData,
} from './utils/authentication';

// GraphQL web server
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

const sess = {
  secret: config.cookie.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: config.cookie.maxAge,
  },
};

if (config.env === 'production') {
  server.set('trust proxy', 1);
  
  const KnexSessionStore = require('connect-session-knex')(session); // eslint-disable-line global-require
  
  sess.cookie.secure = true;
  sess.store = new KnexSessionStore({
    tablename: 'sessions',
    knex: database
  });
}

server.use(session(sess));

server.use(expressJwt({
  secret: config.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.session.token,
}));

server.use(getSessionData);

const graphqlServer = graphQLHTTP((req, res) => ({
  schema,
  graphiql: true,
  pretty: true,
  rootValue: req,
  context: {
    request: req,
    response: res,
  }
}));

server.use('/', graphqlServer);

server.listen(config.port, () => console.log(chalk.green(`GraphQL is listening on port ${config.port}`)));
