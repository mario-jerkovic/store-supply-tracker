module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'pos',
      dateStrings: true,
    }
  },
  staging: {},
  production: {}
};
