const mysql = require('mysql2');
const logger = require('../logging/logger');
const {
  mySQL: { HOST, USER, DATABASE, PASSWORD },
} = require('../config');

// -------------------------
// create connection pool
// -------------------------
const dbPool = mysql
  .createPool({
    connectionLimit: 5,
    host: HOST,
    user: USER,
    database: DATABASE,
    password: PASSWORD,
  })
  .promise();

// -------------------------
// check db health
// return promise with flag <dbIsAlive>
// -------------------------
const dbIsAlive = () => {
  return dbPool
    .execute('select 1')
    .then(() => {
      logger.info('dbIsAlive:success');
      return Promise.resolve({ dbIsAlive: true });
    })
    .catch((err) => {
      logger.error('dbIsAlive:fail ' + err);
      return Promise.resolve({ dbIsAlive: false });
    });
};

module.exports = { dbIsAlive, dbPool };
