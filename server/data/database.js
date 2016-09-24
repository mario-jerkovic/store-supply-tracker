import Knex from 'knex';
import config from '../config/environment';

export const database = Knex(config.knex);

if (config.env === 'development') {
	database.on('start', (builder) => {
		const hrstart = process.hrtime();
		builder.on('end', () => {
			const hrend = process.hrtime(hrstart);
			console.log('Query (Execution time (hr): %ds %dms) \n%s;', hrend[0], hrend[1] / 1000000, builder.toString());
		});
	});
}