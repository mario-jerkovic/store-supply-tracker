import {
	nodeDefinitions,
} from 'graphql-relay';

import { articleType, receiptType } from './schema';

import Article from './models/Article';
import Receipt from './models/Receipt';

export const { nodeInterface, nodeField } = nodeDefinitions(
	async(globalId, session) => {

		console.log('GlobalID', globalId);
		console.log('session', session);
		
		return null;
	},
	(obj) => {
		console.log('NodeInterface', obj);
		if (obj instanceof Article) {
			return articleType;
		} else if (obj instanceof Receipt) {
			return receiptType;
		}
		
		return null;
	}
);