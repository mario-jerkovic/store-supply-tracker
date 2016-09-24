import { database } from '../database';

class Receipt {
	static findByID = async ({ id }) => {
		return await database.select().from('receipt').where('receipt_id', id).then(res => res[0]);
	}
}

export default Receipt;