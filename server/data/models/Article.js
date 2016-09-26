import { database } from '../database';
import logger from '../../utils/logger';

class Article {
  static tableName = 'article';

  static tableInstance = () => database(Article.tableName);

  static findByID = async({ id }) => {
    const initQuery = Article.tableInstance().select();

    if (id) {
      logger.info('Resolving article with params:', { id });

      initQuery.where(`${Article.tableName}_id`, id);
    }

    return {
      ...await initQuery.then(result => result[0]),
    }
  };

  static findAll = async() => {
    logger.info('Getting query findAll for Article model');

    return await Article.tableInstance().then(result => result);
  };
}

export default Article;
