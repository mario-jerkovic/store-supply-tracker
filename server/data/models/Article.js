import { database } from '../database';

class Article {
	static findByID = async ({ id }) => {
		return await database.select().from('article').where('article_id', id).then(res => res[0]);
	}
}

export default Article;