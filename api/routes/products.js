var express = require('express');
var router = express.Router();
var { getClient } = require('../config');

router.get('/mapped', async function (req, res, next) {
    const client = getClient();
    await client.query('SELECT * FROM master_data where category=\'Product\'', (error, result) => {
        if (error) {
            console.error('Error executing SELECT query', error.stack)
        }
        console.log(result.rows)
        res.send({ mappedProducts: result.rows, });

    });
});
module.exports = router;

router.post('/map', async function (req, res, next) {
    const client = getClient();

    const productIDCompanyA = req.body.productIDCompanyA;
    const productIDCompanyB = req.body.productIDCompanyB;
    const name = req.body.name

    await client.query('INSERT INTO master_data (name,reference_1,reference_2, category) VALUES ($1, $2, $3, $4)', [name, productIDCompanyA, productIDCompanyB, 'Product'], (error, result) => {
        if (error) {
            return console.error('Error executing INSERT query', error.stack)
        }
        console.log('added')
    });
});
module.exports = router;
