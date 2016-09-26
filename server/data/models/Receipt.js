import { database } from '../database';
import logger from '../../utils/logger';

class Receipt {
  static tableName = 'receipt';

  static tableInstance = () => database(Receipt.tableName);

  static findByID = async({ id }) => {
    const initQuery = Receipt.tableInstance().select();

    if (id) {
      logger.info('Resolving Receipt with params:', { id });

      initQuery.where(`${Receipt.tableName}_id`, id);
    }

    return {
      ...await initQuery.then(result => result[0]),
    }
  };

  static findAll = async() => {
    logger.info('Getting query findAll for Receipt model');

    return await Receipt.tableInstance().select().then(result => result);
  };
}

export default Receipt;
