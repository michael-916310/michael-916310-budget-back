module.exports = {
  DEFAULT_LANG: 'en',
  DEV_PORT: 3000,
  mongo: {
    MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  },
  mySQL: {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    DATABASE: process.env.MYSQL_DATABASE,
    PASSWORD: process.env.MYSQL_PASSWORD,
  },
};
