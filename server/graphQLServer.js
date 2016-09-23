import express from 'express';
import bodyParser from 'body-parser';
import graphQLHTTP from 'express-graphql';
import { graphqlBatchHTTPWrapper } from 'react-relay-network-layer';
import { schema } from './data';
import config from './config/environment';

export const startGraphQLServer = () => {
	const graphQLServer = express();

	graphQLServer.set('port', config.apiPort);
	graphQLServer.use(bodyParser.json());
	graphQLServer.use(bodyParser.urlencoded({ extended: false }));

	graphQLServer.use('/graphql', (req, res, next) => {
		return graphQLHTTP({ schema, graphiql: false })(req, res, next);
	});

	graphQLServer.use('/batch', (req, res, next) => {
		return graphqlBatchHTTPWrapper(graphQLHTTP({ schema, graphiql: false }))(req, res, next);
	});

	if (config.env === 'development') {
		graphQLServer.use('/graphiql', graphQLHTTP({ schema, graphiql: true, pretty: true }));
	}

	return graphQLServer;
};