var express = require('express');
var router = express.Router();
var { getClient } = require('../config');
var { sendRequest } = require('./../utils/jasmin');

router.get('/mapped', async function (req, res, next) {
    const mappedProducts = await getMappedProducts();
    res.send({ mappedProducts: mappedProducts });
});

module.exports = router;

router.post('/map', async function (req, res, next) {
    const reference_1 = req.body.reference_1;
    const reference_2 = req.body.reference_2;
    let status;

    try {
        status = await mapProducts(reference_1, reference_2);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
});

async function mapProducts(reference_1, reference_2) {
    const client = getClient();
    return client.query('INSERT INTO master_data (reference_1,reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, 'Product'])
}

router.get('/company/:companyID/sales/items', async function (req, res, next) {
    const companyID = req.params.companyID;

    const companyInfo = await getCompanyInformation(companyID);
    const tenant = companyInfo.tenant;
    const organization = companyInfo.organization;
    const itemKeys = await getSalesItems(companyID, tenant, organization);
    res.send(itemKeys);
});

router.get('/company/:companyID/purchase/items', async function (req, res, next) {
    const companyID = req.params.companyID;

    const companyInfo = await getCompanyInformation(companyID);
    const tenant = companyInfo.tenant;
    const organization = companyInfo.organization;
    const itemKeys = await getPurchaseItems(companyID, tenant, organization);
    res.send(itemKeys);
});

async function getCompanyInformation(companyID) {
    const client = getClient();

    return new Promise(function (resolve, reject) {
        client.query(`SELECT tenant, organization FROM companies where id=${companyID}`)
            .then(result => {
                resolve({ tenant: result.rows[0].tenant, organization: result.rows[0].organization });
            }).catch((err) => { console.error('Error executing SELECT query', err.stack) });
    });
};

async function getPurchaseItems(companyID, tenant, organization) {
    return new Promise(function (resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/purchasesCore/purchasesItems', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.itemKey));
            }).catch((err) => { console.log(err) });
    });
};

async function getSalesItems(companyID, tenant, organization) {
    return new Promise(function (resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/salesCore/salesItems', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.itemKey));
            }).catch((err) => { console.log(err) });
    });
};


async function getMappedProducts() {
    const client = getClient();
    return new Promise(function (resolve, reject) {
        client.query('SELECT id, reference_1, reference_2 FROM master_data where category=\'Product\'')
            .then(result => {
                resolve(result.rows);
            }).catch((err) => { console.error('Error executing SELECT query', err.stack) });
    });
}


async function getNotMappedProducts(companyID, productKeys) {
    let mappedQueryResult = await getMappedProducts();
    let unmapped = productKeys;
    let index;
    mappedQueryResult.forEach(row => {
        if (companyID == 1 && (index = productKeys.indexOf(row.reference_1)) != -1) {
            unmapped.splice(index, 1);
        } else if (companyID == 2 && (index = productKeys.indexOf(row.reference_2)) != -1) {
            unmapped.splice(index, 1);
        }
    })

    return unmapped;
}
