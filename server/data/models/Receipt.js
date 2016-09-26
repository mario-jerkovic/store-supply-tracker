import { database } from '../database';

class Receipt {
	static tableName = 'receipt';
	
	static tableInstance = () => database(Receipt.tableName);
	
	static findByID = async ({ id }) => {

		const initQuery = Receipt.tableInstance().select();
		
		if (id) {
			initQuery.where(`${Receipt.tableName}_id`, id);
		}
		
		return {
			...await initQuery.then(result => result[0]),
		}
	};
	
	static findAll = async () => {
		return await Receipt.tableInstance().select().then(result => result);
	};
}

export default Receipt;