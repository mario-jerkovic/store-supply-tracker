import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { graphql } from 'graphql';
import {
	printSchema,
	introspectionQuery,
} from 'graphql/utilities';

import { schema }from '../data';
import { database } from '../data/database';

const jsonFile = path.join(__dirname, '../data/schema.json');
const graphQLFile = path.join(__dirname, '../data/schema.graphql');

async function updateSchema() {
	try {
		const json = await graphql(schema, introspectionQuery);

		fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
		fs.writeFileSync(graphQLFile, printSchema(schema));

		console.log(chalk.green('[updateSchema]  schema has been regenerated'));
		
		// Knexs keep connection alive which makes this process hanging
		// we are explicitly destroying connection pool after schema is
		// generated so program can end, if it's called from the command line
		if (!module.parent) database.destroy();
	} catch (err) {
		console.error(chalk.red(err.stack));
	}
}

// Run the function directly, if it's called from the command line
if (!module.parent) updateSchema();

export default updateSchema;