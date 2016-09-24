import { fromGlobalId } from 'graphql-relay';
import { database } from '../database';

class Article {
	static tableName = 'article';
	
	static tableInstance = () => database(Article.tableName);
	
	static findByID = async ({ id }) => {
		const initQuery = Article.tableInstance().select();
		
		if (id) {
			initQuery.where(`${Article.tableName}_id`, fromGlobalId(id).id);
		}
		
		return {
			...await initQuery.then(result => result[0]),
		}
	};
	
	static findAll = async () => {
		return await Article.tableInstance().then(result => result);
	};
}

export default Article;