import {
	GraphQLID,
	GraphQLFloat,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType,
} from 'graphql';
import {
	globalIdField,
	connectionArgs,
	connectionDefinitions,
} from 'graphql-relay';

import ReceiptArticleMap from '../models/ReceiptArticleMap';

import {
	receiptType,
	articleType,
	nodeInterface,
	totalCountType,
	connectionWithCountDefinition
} from '../schema';

export const receiptArticleType = new GraphQLObjectType({
	name: 'ReceiptArticleMap',
	description: 'Mapping between Receipt and Article',
	fields: () =>({
		id: globalIdField('ReceiptArticleMap', ({ receipt_id, article_id }) => `${receipt_id}:${article_id}`),
		receipt: {
			type: new GraphQLNonNull(receiptType),
			resolve: ({ receipt }) => receipt
		},
		article: {
			type: new GraphQLNonNull(articleType),
			resolve: ({ article }) => article
		},
		articlePrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ article_price }) => article_price
		},
		articleTotalPrice: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ article_total_price }) => article_total_price
		},
		created: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({ article_created }) => article_created,
		},
		updated: {
			type: GraphQLString,
			resolve: ({ article_updated }) => article_updated,
		},
	}),
	interfaces: [nodeInterface],
});

export const {
	connectionType: receiptArticleConnection,
	edgeType: receiptArticleEdge
} = connectionDefinitions({
	name: 'ReceiptArticleMap',
	nodeType: receiptArticleType,
	connectionFields: totalCountType,
});

export const queryReceiptArticleMap = {
	type: receiptArticleType,
	args: {
		id: {
			type: GraphQLID,
		},
		receiptID: {
			type: GraphQLID,
		},
		articleID: {
			type: GraphQLID,
		},
	},
	resolve: (rootValue, args, context, info) => ReceiptArticleMap.findByID(args),
};