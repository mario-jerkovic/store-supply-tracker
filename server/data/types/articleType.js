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
	connectionArgs,
	connectionDefinitions,
} from 'graphql-relay';

import Article from '../models/Article';
import { nodeInterface, totalCountType, connectionWithCountDefinition } from '../schema';

export const articleType = new GraphQLObjectType({
	name: 'Article',
	description: 'Single article in inventory',
	fields: () =>({
		id: globalIdField('Article', ({ article_id }) => article_id),
		name: {
			type: new GraphQLNonNull(GraphQLString),
			description: '',
			resolve: ({ article_name }) => article_name,
		},
		quantity: {
			type: new GraphQLNonNull(GraphQLFloat),
			resolve: ({ article_quantity }) => article_quantity,
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
	connectionType: articleConnection,
	edgeType: articleEdge
} = connectionDefinitions({
	name: 'Article',
	nodeType: articleType,
	connectionFields: totalCountType,
});

export const queryArticle = {
	type: articleType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID),
		},
	},
	resolve: (rootValue, args, context, info) => Article.findByID({ id: fromGlobalId(args.id).id }),
};

export const queryArticleConnection = {
	type: articleConnection,
	args: connectionArgs,
	resolve: (rootValue, args, context, info) => connectionWithCountDefinition(Article, args, context, info)
};