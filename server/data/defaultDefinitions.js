import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

// import * as models from './models';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
export const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId, context, info) => { // eslint-disable-line no-unused-vars
    const { type, id } = fromGlobalId(globalId);
    console.log('type, id: ', type, id);
  
    // if (models[type]) {
    //   if (type === 'Viewer') { // Viewer is singeltone so we always get same
    //     return { ...models[type].getViewer({ context, info }), type: models[type].graphQLType };
    //   }
    //   return { ...await models[type].findById(id, context, info), type: models[type].graphQLType };
    // }
    
    return null;
  },
  (obj) => {
    console.log('OBJ: ', obj);;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    if (obj && obj.type) {
      return obj.type;
    }
    
    return null;
  }
);
