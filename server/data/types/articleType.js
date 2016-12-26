import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

import {
  fromGlobalId,
} from 'graphql-relay';

import { nodeInterface } from '../defaultDefinitions';

import * as types from './';

export const articleType = new GraphQLObjectType({
  name: 'article',
  sqlTable: 'article',
  uniqueKey: 'id',
  description: 'Single article',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    articleId: {
      sqlColumn: 'id',
      type: new GraphQLNonNull(GraphQLInt)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    receiptArticle: {
      type: new GraphQLList(types.receiptArticleType),
      sqlJoin: (articleTable, receiptArticleTable) => `${articleTable}.id = ${receiptArticleTable}.article_id`
    },
    created: {
      type: new GraphQLNonNull(GraphQLString),
    },
    updated: {
      type: GraphQLString,
    },
  }),
  interfaces: [nodeInterface],
});

export const queryArticle = {
  type: articleType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  where: (usersTable, args, context) => `${usersTable}.id = ${fromGlobalId(args.id).id}`, // eslint-disable-line no-unused-vars
};

