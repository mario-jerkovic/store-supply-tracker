import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import {
  fromGlobalId,
  connectionDefinitions,
} from 'graphql-relay';

import { nodeInterface } from '../defaultDefinitions';

import * as types from './';

export const receiptArticleType = new GraphQLObjectType({
  name: 'receiptArticle',
  sqlTable: 'receipt_article',
  uniqueKey: ['receipt_id', 'article_id'],
  description: 'Mapping between receipt and article type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    receiptId: {
      sqlColumn: 'receipt_id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    articleId: {
      sqlColumn: 'article_id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    receipt: {
      type: types.receiptType,
      sqlJoin: (receiptArticleTable, receiptTable) => `${receiptArticleTable}.receipt_id = ${receiptTable}.id`,
    },
    article: {
      type: types.articleType,
      sqlJoin: (receiptArticleTable, articleTable) => `${receiptArticleTable}.article_id = ${articleTable}.id`,
    }
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: receiptArticleConnection } = connectionDefinitions({ nodeType: receiptArticleType });

export const queryReceiptArticleType = {
  type: receiptArticleType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  where: (usersTable, args, context) => { // eslint-disable-line no-unused-vars
    const ids = fromGlobalId(args.id).id.split(':');
    return (
      `${usersTable}.receipt_id = ${ids[0]} AND ${usersTable}.article_id = ${ids[1]}`
    );
  },
};

