import { database } from '../database';
import Article from './Article';

class Receipt {
	static tableName = 'receipt';
	
	static findByID = async ({ id }) => {
		const receiptResult = await database.select().from(Receipt.tableName).where(`${Receipt.tableName}_id`, id).then(res => res[0]);
		const articleResult = await Article.findByID({ id: receiptResult.article_id });
		
		return {
			...receiptResult,
			article: articleResult
		}
	};
	
	static findAll = async () => {
		return await database.select().from(Receipt.tableName).then(res => res);
	};
}

export default Receipt;