var express = require('express');
var router = express.Router();

var { getCompaniesInformation } = require('../utils/requests');

router.get('/company', async function (req, res, next) {

  try {
    let companiesInfo = await getCompaniesInformation();
    companiesInfo = companiesInfo.rows;
    res.send(companiesInfo)
  } catch (err) { }
});

module.exports = router;
