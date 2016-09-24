import {
	GraphQLID,
	GraphQLFloat,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType,
} from 'graphql';
import {
	fromGlobalId,
	globalIdField,
	connectionDefinitions,
} from 'graphql-relay';

import Receipt from '../models/Receipt';
import { queryArticle } from '../schema';
import { nodeInterface } from '../defaultDefinitions';

export const receiptType = new GraphQLObjectType({
	name: 'receipt',
	description: 'Single receipt',
	fields: () =>({
		id: globalIdField('Receipt', ({ receipt_id }) => receipt_id),
		article: queryArticle,
		price: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ receipt_price }) => receipt_price,
		},
		total: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ receipt_total }) => receipt_total
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
} = connectionDefinitions({ name: 'receipt', nodeType: receiptType });

export const queryReceipt = {
	type: receiptType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	resolve: (rootValue, args, context, info) => {
		return Receipt.findByID({ id: fromGlobalId(args.id).id });
	},
};