import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { graphql } from 'graphql';
import {
	printSchema,
	introspectionQuery,
} from 'graphql/utilities';

import { schema }from '../data';

const jsonFile = path.join(__dirname, '../data/schema.json');
const graphQLFile = path.join(__dirname, '../data/schema.graphql');

async function updateSchema() {
	try {
		const json = await graphql(schema, introspectionQuery);

		fs.writeFileSync(jsonFile, JSON.stringify(json, null, 2));
		fs.writeFileSync(graphQLFile, printSchema(schema));

		console.log(chalk.green('[updateSchema]  schema has been regenerated'));
	} catch (err) {
		console.error(chalk.red(err.stack));
	}
}

// Run the function directly, if it's called from the command line
if (!module.parent) updateSchema();

export default updateSchema;