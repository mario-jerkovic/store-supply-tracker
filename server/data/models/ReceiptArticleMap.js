import { fromGlobalId } from 'graphql-relay';
import { database } from '../database';
import Receipt from './Receipt';
import Article from './Article';

class ReceiptArticleMap {
	static tableName = 'receipt_article_map';
	
	static tableInstance = () => database(ReceiptArticleMap.tableName);
	
	static joinedResources = ({ receipt_id, article_id }) => {
		return {
			receipt: Receipt.findByID({ id: receipt_id }),
			article: Article.findByID({ id: article_id }),
		}
	};
	
	static findByID = async({ id, receiptID, articleID }) => {
		const initQuery = ReceiptArticleMap.tableInstance().select();
		
		if (id) {
			const extractedID = fromGlobalId(id).id.split(':');
			
			initQuery.where(`${Receipt.tableName}_id`, extractedID[0]);
			initQuery.where(`${Article.tableName}_id`, extractedID[1]);
		} else if (receiptID) {
			initQuery.where(`${Receipt.tableName}_id`, fromGlobalId(receiptID).id);
		} else if (articleID) {
			initQuery.where(`${Article.tableName}_id`, fromGlobalId(articleID).id);
		} else {
			// TODO throw GraphQL error,
			// TODO think about using only one argument adn dynamically change the query
		}
		
		const result = await initQuery.then(result => result[0]);
		
		return {
			...result,
			...ReceiptArticleMap.joinedResources({
				receipt_id: result.receipt_id,
				article_id: result.article_id,
			}),
		}
	};
}

export default ReceiptArticleMap;