const { dbIsAlive, dbPool } = require('./../../common/db/connectDb');

function getUserIdByCode(code) {
  return new Promise((resolve) => {
    dbIsAlive().then((state) => {
      if (state.dbIsAlive) {
        dbPool
          .query(
            `
            select u.id, u.name
            from users u inner join logins l on u.id = l.userId and l.code='${code}'`
          )
          .then(([row]) => {
            if (row.length > 0) {
              resolve({
                id: row[0].id,
                name: row[0].name,
              });
            } else {
              resolve({
                id: -2,
                name: '-2',
              });
            }
          });
      } else {
        resolve({
          id: -1,
          name: '-1',
        });
      }
    });
  });
}

function getExpenseItems() {
  return new Promise((resolve, reject) => {
    dbIsAlive().then((state) => {
      if (state.dbIsAlive) {
        dbPool
          .query(
            `
            select id, name, oftenUsed, obsolete
            from expenseItems`
          )
          .then(([row]) => {
            resolve(row);
          });
      }
    });
  });
}


function getExpenseGroups() {
  return new Promise((resolve, reject) => {
    dbIsAlive().then((state) => {
      if (state.dbIsAlive) {
        dbPool
          .query(
            `
            select id, name, obsolete, defaultSelection
            from expenseGroups`
          )
          .then(([row]) => {
            resolve(row);
          });
      }
    });
  });
}

function addExpense(
  expenseDate,
  expenseGroupId,
  expenseId,
  expenseSum,
  expenseComment
) {
  return new Promise((resolve, reject) => {
    const period = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
    const strDate = `${expenseDate.getFullYear()}/${
      expenseDate.getMonth() + 1
    }/${expenseDate.getDate()}`;
    const day = expenseDate.getDate();
    dbIsAlive().then((state) => {
      if (state.dbIsAlive) {
        const sql = `
          insert into expenseRecords
            (period,      day,     date,        expenseGroupId,    expenseItemId, description,        amount)
          values
            ('${period}', ${day}, '${strDate}', ${expenseGroupId}, ${expenseId}, '${expenseComment}', ${expenseSum})
        `;
        dbPool
          .query(sql)
          .then(([ResultSetHeader]) => {
            resolve({
              status: 1,
              message: 'OK',
            });
          })
          .catch((err) => {
            reject(err.message);
          });
      }
    });
  });
}

module.exports = {
  users: {
    getUserIdByCode,
  },
  references: {
    getExpenseItems,
    getExpenseGroups,
  },
  expenses: {
    addExpense,
  }
};
