import { database } from '../database';

class Article {
	static tableName = 'article';
	
	static findByID = async ({ id }) => {
		return await database.select().from(Article.tableName).where(`${Article.tableName}_id`, id).then(res => res[0]);
	};
	
	static findAll = async () => {
		return await database.select().from(Article.tableName).then(res => res[0]);
	};
}

export default Article;