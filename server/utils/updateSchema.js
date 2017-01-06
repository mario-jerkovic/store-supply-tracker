import fs from 'fs';
import path from 'path';
import {
  graphql,
} from 'graphql';
import {
  printSchema,
  introspectionQuery,
} from 'graphql/utilities';
import {
  logger,
} from './';
import schema from '../data/schema';
import database from '../data/database';

const jsonFile = path.join(__dirname, '../data/schema.json');
const graphQLFile = path.join(__dirname, '../data/schema.graphql');

async function updateSchema() {
  try {
    const json = await graphql(schema, introspectionQuery);
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
    fs.writeFileSync(graphQLFile, printSchema(schema));
    logger.info('Schema has been regenerated');

    // knex keep connection alive which makes this process hanging
    // we are explicitly destroying connection pool after schema is
    // generated so program can end, if it's called from the command line
    if (!module.parent) {
      database.destroy();
    }
  } catch (err) {
    logger.error(err.stack);
  }
}

// Run the function directly, if it's called from the command line
if (!module.parent) {
  updateSchema();
}

export default updateSchema;
