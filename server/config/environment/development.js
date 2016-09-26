export default {
  knex: {
    client: 'mysql',
    connection: {
      timezone: '+00:00',
      host: 'localhost',
      user: 'root',
      password: 'root',
      dateStrings: true,
      database: 'store_supply'
    },
    pool: {
      min: 2,
      max: 10
    },
    debug: false
  },
};
