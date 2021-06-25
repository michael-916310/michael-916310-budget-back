const expenseGroupData = require('./tableData').expenseGroupData;
const expenseItemsData = require('./tableData').expenseItemsData;
const userData = require('./tableData').userData;

const logger = require('../logging/logger');
const { dbIsAlive, dbPool } = require('./connectDb');

// -------------------------
// helper for reference population
// -------------------------
async function loadOneColumnRefData(data, tableRows, tableName) {
  for (let i = 0; i < data.length; i++) {
    const name = data[i];
    if (tableRows.filter((row) => row.name === name).length === 0) {
      await dbPool.execute(
        `insert into ${tableName} (name) values ("${name}")`
      );
      //logger.info(`${tableName} table: inserted "${name}"`);
    } else {
      //logger.info(`${tableName} table: row exist "${name}"`);
    }
  }
}

function createTables() {
  const createExpenseGroup = `create table if not exists expenseGroups(
    id int primary key auto_increment,
    name varchar(255) not null
  )`;
  const createExpenseItems = `create table if not exists expenseItems(
    id int primary key auto_increment,
    name varchar(255) not null
  )`;
  const createExpenseRecords = `create table if not exists expenseRecords(
    id int primary key auto_increment,
    period varchar(10) not null,
    day int not null,
    date datetime not null,
    expenseGroupId int not null,
    expenseItemId int not null,
    description varchar(500),
    amount numeric(18,2)  not null,
    FOREIGN KEY (expenseGroupId) REFERENCES expenseGroups (id),
    FOREIGN KEY (expenseItemId) REFERENCES expenseItems (id)
  )`;
  const createUserTable = `create table if not exists users(
    id int primary key auto_increment,
    name varchar(50) not null
  )`;
  const createLoginTable = `create table if not exists logins(
    id int primary key auto_increment,
    userId int not null,
    code varchar(50) not null,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`;

  return dbPool
    .execute(createExpenseGroup)
    .then(() => {
      return dbPool.execute(createExpenseItems);
    })
    .then(() => {
      return dbPool.execute(createExpenseRecords);
    })
    .then(() => {
      return dbPool.execute(createUserTable);
    })
    .then(() => {
      return dbPool.execute(createLoginTable);
    });
}

function loadDate() {
  let loginData = [];

  return dbPool
    .execute(`select name from expenseGroups`)
    .then(([rows]) => {
      return loadOneColumnRefData(expenseGroupData, rows, 'expenseGroups');
    })
    .then(() => {
      return dbPool.execute(`select name from expenseItems`);
    })
    .then(([rows]) => {
      return loadOneColumnRefData(expenseItemsData, rows, 'expenseItems');
    })
    .then(() => {
      return dbPool.execute(`select id, name from users`);
    })
    .then(([rows]) => {
      return loadOneColumnRefData(userData, rows, 'users');
    })
    .then(() => {
      return dbPool.execute(`select id, name from users`);
    })
    .then(([rows]) => {
      loginData = [
        { userId: rows[0].id, code: '89521' },
        { userId: rows[1].id, code: '29295' },
      ];
    })
    .then(() => {
      return dbPool.execute(`select userId, code from logins`);
    })
    .then(([rows]) => {
      loginData.forEach((item) => {
        if (rows.filter((row) => row.code === item.code).length === 0) {
          dbPool.execute(
            `insert into logins (userId, code) values (${item.userId}, "${item.code}")`
          );
        }
      });
    });
}

// -------------------------
// create tables
// populate references
// -------------------------
dbIsAlive().then((res) => {
  if (res.dbIsAlive) {
    createTables()
      .then(() => {
        logger.info('start load data');
        return loadDate();
      })
      .then(() => {
        logger.info('load data finished');
      });
  } else {
    logger.error(`Create and populate tables is fail. dbIsAlive:false`);
  }
});
