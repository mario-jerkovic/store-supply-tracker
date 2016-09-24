import {
	GraphQLID,
	GraphQLInt,
	GraphQLFloat,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType,
} from 'graphql';
import {
	fromGlobalId,
	globalIdField,
	connectionArgs,
	connectionDefinitions,
} from 'graphql-relay';

import Receipt from '../models/Receipt';
import { nodeInterface } from '../defaultDefinitions';
import { totalCountType, connectionWithCountDefinition } from '../schema';

export const receiptType = new GraphQLObjectType({
	name: 'receipt',
	description: 'Single receipt',
	fields: () =>({
		id: globalIdField('Receipt', ({ receipt_id }) => receipt_id),
		number: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({ receipt_number }) => receipt_number,
		},
		total: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ receipt_total }) => receipt_total,
		},
		date: {
			type: GraphQLString,
			resolve: ({ receipt_data }) => receipt_data,
		},
		created: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({ receipt_created }) => receipt_created,
		},
		updated: {
			type: GraphQLString,
			resolve: ({ receipt_updated }) => receipt_updated,
		},
	}),
	interfaces: [nodeInterface],
});

export const {
	connectionType: receiptConnection,
	edgeType: receiptEdge
} = connectionDefinitions({
	name: 'receipt',
	nodeType: receiptType,
	connectionFields: totalCountType,
});

export const queryReceipt = {
	type: receiptType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	resolve: (rootValue, args, context, info) => Receipt.findByID(args),
};

export const queryReceiptConnection = {
	type: receiptConnection,
	args: connectionArgs,
	resolve: (rootValue, args, context, info) => connectionWithCountDefinition(Receipt, args, context, info)
};