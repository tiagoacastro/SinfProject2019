var express = require('express');
var router = express.Router();
var { getClient } = require('../config');
var { sendRequest } = require('./../utils/jasmin');
var { getCompanyInformation, getMappedProducts } = require('../utils/requests')

router.get('/mapped', async function (req, res, next) {
    const mappedProducts = await getMappedProducts();
    res.send({ mappedProducts: mappedProducts.rows });
});

router.post('/map', async function (req, res, next) {
    const reference_1 = req.body.reference_1;
    const reference_2 = req.body.reference_2;

    try {
        await mapProducts(reference_1, reference_2);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;

    try {
        await unmapProducts(id);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }

});

async function mapProducts(reference_1, reference_2) {
    const client = getClient();
    return client.query('INSERT INTO master_data (reference_1,reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, 'Product'])
}

async function unmapProducts(id) {
    const client = getClient();
    return client.query('DELETE from master_data WHERE id=$1', [id])
}

async function getMappedProducts() {
    const client = getClient();
    return new Promise(function (resolve, reject) {
        client.query('SELECT id, reference_1, reference_2 FROM master_data where category=\'Product\'')
            .then(result => {
                resolve(result.rows);
            }).catch((err) => { console.error('Error executing SELECT query', err.stack) });
    });
}

module.exports = router;
