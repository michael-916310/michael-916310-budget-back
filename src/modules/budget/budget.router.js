const express = require('express');
const service = require('./budget.service');

const router = express.Router();

router.post('/user/check', (req, res) => {
  const code = req.body.userCode;
  if (code == undefined || code.length == 0) {
    res.json(
      JSON.stringify({
        userId: -3,
        userName: '-3',
      })
    );
  } else {
    service.users.getUserIdByCode(code).then((result) => {
      console.log(result);
      res.json(
        JSON.stringify({
          userId: result.id,
          userName: result.name,
        })
      );
    });
  }
});

router.post('/references/expenseItems', (req, res) => {
  service.references.getExpenseItems().then((data) => {
    const d = JSON.stringify(data);
    res.json(d);
  });
});

router.post('/references/expenseGroups', (req, res) => {
  service.references.getExpenseGroups().then((data) => {
    const d = JSON.stringify(data);
    res.json(d);
  });
})

router.post('/expense/add', (req, res) => {
  const expenseGroupId = +req.body.expenseGroupId;
  const expenseId = +req.body.expenseId;
  const expenseSum = +req.body.expenseSum;
  const expenseDate = new Date(req.body.expenseDate);
  const expenseComment = req.body.expenseComment || '';

  let result = {
    status: 0,
    message: '',
  };

  if (!(expenseId > 0)) {
    res.json({
      status: -1,
      message: 'Не указана статья затрат',
    });
  } else if (!(expenseGroupId > 0)) {
    res.json({
      status: -1,
      message: 'Не указана группа затрат',
    });
  } else if (!(expenseSum > 0 || expenseSum < 0)) {
    res.json({
      status: -1,
      message: 'Не указана сумма',
    });
  } else if (!req.body.expenseDate) {
    res.json({
      status: -1,
      message: 'Не указана дата',
    });
  } else {
    service.expenses
      .addExpense(
        expenseDate,
        expenseGroupId,
        expenseId,
        expenseSum,
        expenseComment
      )
      .then(() => {
        res.json({
          status: 1,
          message: 'OK',
        });
      })
      .catch((errMessage) => {
        res.json({
          status: -1,
          message: errMessage,
        });
      });
  }
  //console.log(expenseId, expenseGroupId, expenseSum, expenseDate, expenseComment);
});

router.post('/expense/getList', (req, res) => {
  (async function () {
    const list = await service.expenses.getExpenseList();
    res.json(JSON.stringify(list));
  })();
});

router.delete('/expense/delete', (req, res) => {
  const recordId = +req.body.recordId;

  if (!(recordId > 0)) {
    res.json(
      JSON.stringify({
        status: -1,
        message: 'Не указана запись',
      })
    );
  } else {
    service.expenses.deleteExpense(recordId).then((colRows) => {
      if (colRows === 1) {
        res.json(
          JSON.stringify({
            status: 1,
            message: 'OK',
          })
        );
      } else if (colRows === 0) {
        res.json(
          JSON.stringify({
            status: -1,
            message: `Запись с id:${recordId} не удалена`,
          })
        );
      }
    });
  }
});

module.exports = router;
