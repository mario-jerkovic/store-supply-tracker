import {
  GraphQLID,
  GraphQLInt,
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

import { nodeInterface } from '../defaultDefinitions';
import {
  totalCountType,
  connectionWithCountDefinition
} from '../schema';

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
    number: {
      type: new GraphQLNonNull(GraphQLString),
    },
    total: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    receiptArticle: {
      type: types.receiptArticleType,
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

// export const {
//   connectionType: receiptConnection,
//   edgeType: receiptEdge
// } = connectionDefinitions({
//   name: 'receipt',
//   nodeType: receiptType,
//   connectionFields: totalCountType,
// });


export const queryReceipt = {
  type: receiptType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  where: (usersTable, args, context) => ( // eslint-disable-line no-unused-vars
    `${usersTable}.id = ${fromGlobalId(args.id).id}`
  ),
  // sqlJoin: (userTable, postTable) => `${userTable}.id = ${postTable}.author_id`
};

// export const queryReceiptConnection = {
//   type: receiptConnection,
//   args: connectionArgs,
//   resolve: (rootValue, args, context, info) => connectionWithCountDefinition(Receipt, args, context, info)
// };
