var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { getCompanyInformation, getMappedProducts, getMappedEntities } = require('../utils/requests')
const { getNotMappedProducts, getNotMappedEntities } = require('../utils/utils')


var router = express.Router({ mergeParams: true });

router.get('/items', async function(req, res, next) {
    const companyID = req.params.companyID;
    try {
        const companyInfo = await getCompanyInformation(companyID);
        const tenant = companyInfo.tenant;
        const organization = companyInfo.organization;

        const itemKeys = await getSalesItems(companyID, tenant, organization);
        const mappedItems = await getMappedProducts(companyID, tenant, organization);
        const unmappedProducts = await getNotMappedProducts(companyID, itemKeys, mappedItems.rows);

        res.send(unmappedProducts);
    } catch (err) { res.sendStatus(400) }
});

async function getSalesItems(companyID, tenant, organization) {
    return new Promise(function(resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/salesCore/salesItems', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.itemKey));
            }).catch((err) => { console.log(err) });
    });
};

router.get('/costumers', async function(req, res, next) {
    const companyID = req.params.companyID;
    try {
        const companyInfo = await getCompanyInformation(companyID);
        const tenant = companyInfo.tenant;
        const organization = companyInfo.organization;

        const costumerKeys = await getCostumers(companyID, tenant, organization);
        const mappedCostumers = await getMappedEntities(companyID, tenant, organization);
        const unmappedCostumers = await getNotMappedEntities(false, costumerKeys, mappedCostumers.rows);

        res.send(unmappedCostumers);
    } catch (err) {
        cosole.log(err);
        res.sendStatus(400)
    }
});

async function getCostumers(companyID, tenant, organization) {
    return new Promise(function(resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/salesCore/customerParties', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.partyKey));
            }).catch((err) => { console.log(err) });
    });
};


router.get('/', function(req, res, next) {
    const { id } = req.params;
    var data = sendRequest('get', 'https://my.jasminsoftware.com/api/224814/224814-0001/sales/orders', 1);
    console.log(data);
    res.send('respond with a resource');
});


module.exports = router;