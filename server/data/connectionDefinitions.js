import {
	GraphQLInt,
	GraphQLNonNull,
} from 'graphql';
import {
	cursorToOffset,
	connectionFromArraySlice,
} from 'graphql-relay';

import { database } from './database';

export const totalCountType = {
	totalCount: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'The number of nodes in edges array.',
		resolve: ({ totalCount }) => totalCount
	}
};

export const connectionWithCountDefinition = async (model, args, context, info) => {
	let offset = 0;
	const totalCount = await database(model.tableName).count().then((res) => res[0]['count(*)']);
	const limit = args.first || args.last || totalCount;
	
	if (args.after) {
		offset = cursorToOffset(args.after) + 1;
	} else if (args.before) {
		offset = Math.max(cursorToOffset(args.before) - limit, 0);
	} else if (args.last) {
		offset = Math.max(totalCount - limit, 0)
	}
	
	let result = await model.tableInstance().select().limit(limit).offset(offset);
	
	if (model.joinedResources) {
		result = result.map((item) => Object.assign(item, model.joinedResources(item)));
	}
	
	return {
		totalCount,
		...connectionFromArraySlice(result, args, { sliceStart: offset, arrayLength: totalCount })
	};
};
