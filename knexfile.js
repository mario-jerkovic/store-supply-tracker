module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'store_supply',
      dateStrings: true,
    }
  },
  staging: {},
  production: {}
};
