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
  forwardConnectionArgs,
} from 'graphql-relay';

import { nodeInterface } from '../defaultDefinitions';

import * as types from './';

export const receiptType = new GraphQLObjectType({
  name: 'receipt',
  sqlTable: 'receipt',
  uniqueKey: 'id',
  description: 'Single receipt',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    receiptId: {
      sqlColumn: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
    number: {
      type: new GraphQLNonNull(GraphQLString),
    },
    total: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    receiptArticle: {
      type: new GraphQLList(types.receiptArticleType),
      sqlJoin: (receiptTable, receiptArticleTable) => `${receiptTable}.id = ${receiptArticleTable}.receipt_id`
    },
    receiptArticleConnection: {
      type: types.receiptArticleConnection,
      args: forwardConnectionArgs,
      paginate: true,
      sqlJoin: (receiptTable, receiptArticleTable) => `${receiptTable}.id = ${receiptArticleTable}.receipt_id`
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

export const queryReceipt = {
  type: receiptType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  where: (usersTable, args, context) => `${usersTable}.id = ${fromGlobalId(args.id).id}`, // eslint-disable-line no-unused-vars
};
