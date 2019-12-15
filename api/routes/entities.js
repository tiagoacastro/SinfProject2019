var express = require('express');
var router = express.Router();
var { getClient } = require('../config');
const { getMappedEntities } = require('../utils/requests')

router.get('/mapped', async function (req, res, next) {
    const mappedEntities = await getMappedEntities();
    res.send({ mappedEntities: mappedEntities.rows });
});

router.post('/map', async function (req, res, next) {
    const reference_1 = req.body.reference_1;
    const reference_2 = req.body.reference_2;
    const category = req.body.category;
    console.log(reference_1, reference_2, category)

    try {
        await mapEnteties(category, reference_1, reference_2);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
        console.log(err)
    }
});

router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;

    try {
        await unmapEnteties(id);
        res.sendStatus(200);
    } catch (err) {
        console.log(err)
        res.sendStatus(400);
    }

});

async function mapEnteties(category, reference_1, reference_2) {
    const client = getClient();
    return client.query('UPDATE master_data set reference_1=$1, reference_2=$2 where category=$3', [reference_1, reference_2, category]);
}

async function unmapEnteties(id) {
    const client = getClient();
    return client.query('DELETE FROM master_data WHERE id=$1', [id]);
}



module.exports = router;
