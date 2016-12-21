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

import { nodeInterface } from '../defaultDefinitions';
import {
  totalCountType,
  connectionWithCountDefinition
} from '../schema';

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
      type: new GraphQLNonNull(GraphQLFloat),
    },
    date: {
      type: GraphQLString,
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
    `${usersTable}.id = ${args.id}`
  ),
  // sqlJoin: (userTable, postTable) => `${userTable}.id = ${postTable}.author_id`
};

// export const queryReceiptConnection = {
//   type: receiptConnection,
//   args: connectionArgs,
//   resolve: (rootValue, args, context, info) => connectionWithCountDefinition(Receipt, args, context, info)
// };
