import {
	GraphQLSchema,
	GraphQLObjectType,
} from 'graphql';
import {
	globalIdField,
} from 'graphql-relay';

import { nodeField, nodeInterface } from './defaultDefinitions';
export * from './defaultDefinitions';

import { totalCountType, connectionWithCountDefinition } from './connectionDefinitions';
export * from './connectionDefinitions';

import { queryArticle, queryArticleConnection } from './types/articleType';
export * from './types/articleType';

import { queryReceipt } from './types/receiptType';
export * from './types/receiptType';

const viewerType = new GraphQLObjectType({
	name: 'Viewer',
	fields: () => ({
		id: globalIdField('Viewer'),
		article: queryArticle,
		articleConnection: queryArticleConnection,
		receipt: queryReceipt,
	}),
	interfaces: [nodeInterface],
});
/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     factions(names: [FactionName]): [Faction]
 *     node(id: String!): Node
 *   }
 */
const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		viewer: {
			type: viewerType,
			resolve: (rootValue, args, context, info) => ({ id: "userID" })
		},
		
		node: nodeField,
	}),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 *
 * This implements the following type system shorthand:
 *   type Mutation {
 *     introduceShip(input IntroduceShipInput!): IntroduceShipPayload
 *   }
 */
const mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		placeholder: require('./placeholder').default,
	}),
});

/**
 * Finally,  we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
	query: queryType,
	//mutation: mutationType,
});

export default Schema;