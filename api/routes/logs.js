var express = require('express');
var router = express.Router();
var { getClient } = require('../config');

router.get('/', async function (req, res, next) {
    const logs = await getLogs();
    console.log(logs.row)
    res.send({ logs: logs.rows });
});

async function getLogs() {
    const client = getClient();
    return client.query('SELECT logs.*, companies.name FROM logs INNER JOIN companies ON (logs.id_company = companies.id)');
}


module.exports = router;