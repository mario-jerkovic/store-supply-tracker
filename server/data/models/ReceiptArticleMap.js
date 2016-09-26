import { database } from '../database';
import logger from '../../utils/logger';
import Receipt from './Receipt';
import Article from './Article';

class ReceiptArticleMap {
	static tableName = 'receipt_article_map';

	static tableInstance = () => database(ReceiptArticleMap.tableName);

	static joinedResources = ({ receipt_id, article_id }) => {
    logger.info('Resolving receiptArticleMap joining resources with params:', { receipt_id, article_id });

		return {
			receipt: Receipt.findByID({ id: receipt_id }),
			article: Article.findByID({ id: article_id }),
		}
	};

	static findByID = async({ id, receiptID, articleID }) => {
		const initQuery = ReceiptArticleMap.tableInstance().select();

		if (id) {
		  logger.info('Resolving receiptArticleMap with params:', { id });
			const extractedID = id.split(':');

			initQuery.where(`${Receipt.tableName}_id`, extractedID[0]);
			initQuery.where(`${Article.tableName}_id`, extractedID[1]);
		} else if (receiptID) {
      logger.info('Resolving receiptArticleMap join on receipt table with params:', { id: receiptID });

			initQuery.where(`${Receipt.tableName}_id`, receiptID);
		} else if (articleID) {
      logger.info('Resolving receiptArticleMap join on article table with params:', { id: articleID });

      initQuery.where(`${Article.tableName}_id`, articleID);
		} else {
			// TODO throw GraphQL error,
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
