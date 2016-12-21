import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  globalIdField,
} from 'graphql-relay';

import * as types from './';
import database from '../database';
import {
  ConvergeType,
} from '../orm';
import {
  nodeInterface,
} from '../defaultDefinitions';

export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: globalIdField('Viewer'),
    personId: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    },
    receipt: new ConvergeType({ outputType: types.queryReceipt, knex: database }).outputType,
  }),
  interfaces: () => [nodeInterface]
});

export const queryViewer = {
  type: viewerType,
  args: {},
  resolve: (source, args, context) => (
    Object.assign({}, {
      id: 1, // hardcoded for viewer
      token: context.request.session.token,
      personId: context.request.user.personId,
    })
  )
};

export default viewerType;
