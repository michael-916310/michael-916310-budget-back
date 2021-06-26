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

module.exports = router;
