var express = require('express');
var router = express.Router();
var { getClient } = require('../config');

router.get('/mapped', async function (req, res, next) {
    const mappedEntities = await getMappedEntities();
    res.send({ mappedEntities: mappedEntities });
});

router.post('/map', async function (req, res, next) {
    const reference_1 = req.body.reference_1;
    const reference_2 = req.body.reference_2;

    try {
        await mapEnteties(reference_1, reference_2);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
});

async function mapEnteties(reference_1, reference_2) {
    const client = getClient();
    return client.query('INSERT INTO master_data (reference_1,reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, 'Entity'])
}

async function getMappedEntities() {
    const client = getClient();
    return new Promise(function (resolve, reject) {
        client.query('SELECT id, reference_1, reference_2 FROM master_data where category=\'Entity\'')
            .then(result => {
                resolve(result.rows);
            }).catch((err) => { console.error('Error executing SELECT query', err.stack) });
    });
}



module.exports = router;
