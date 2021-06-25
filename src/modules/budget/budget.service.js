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

module.exports = {
  users: {
    getUserIdByCode,
  },
};
