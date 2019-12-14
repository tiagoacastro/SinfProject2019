var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { getCompanyInformation, getMappedProducts, getMappedEntities } = require('../utils/requests')
const { getNotMappedProducts, getNotMappedEntities } = require('../utils/utils')

var router = express.Router({ mergeParams: true });

router.get('/items', async function (req, res, next) {
    const companyID = req.params.companyID;
    try {
        const companyInfo = await getCompanyInformation(companyID);
        const tenant = companyInfo.tenant;
        const organization = companyInfo.organization;

        const itemKeys = await getPurchaseItems(companyID, tenant, organization);
        const mappedItems = await getMappedProducts(companyID, tenant, organization);
        const unmappedProducts = await getNotMappedProducts(companyID, itemKeys, mappedItems.rows);

        res.send(unmappedProducts);
    } catch (err) { res.sendStatus(400) }
});

async function getPurchaseItems(companyID, tenant, organization) {
    return new Promise(function (resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/purchasesCore/purchasesItems', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.itemKey));
            }).catch((err) => { console.log(err) });
    });
};

router.get('/suppliers', async function (req, res, next) {
    const companyID = req.params.companyID;

    try {
        const companyInfo = await getCompanyInformation(companyID);
        const tenant = companyInfo.tenant;
        const organization = companyInfo.organization;

        const supplierKeys = await getSuppliers(companyID, tenant, organization);
        const mappedSuppliers = await getMappedEntities(companyID, tenant, organization);
        const unmappedSuppliers = await getNotMappedEntities(true, supplierKeys, mappedSuppliers.rows);

        res.send(unmappedSuppliers);
    } catch (err) { console.log(err) }
});

async function getSuppliers(companyID, tenant, organization) {
    return new Promise(function (resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/purchasesCore/supplierParties', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.partyKey));
            }).catch((err) => { console.log(err) });
    });
};

module.exports = router;
