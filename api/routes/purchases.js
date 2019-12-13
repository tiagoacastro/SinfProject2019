var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')
var { getCompanyInformation } = require('../utils/requests')

var router = express.Router({ mergeParams: true });

router.get('/items', async function (req, res, next) {
    const companyID = req.params.companyID;

    const companyInfo = await getCompanyInformation(companyID);
    const tenant = companyInfo.tenant;
    const organization = companyInfo.organization;
    const itemKeys = await getPurchaseItems(companyID, tenant, organization);
    res.send(itemKeys);
});

async function getPurchaseItems(companyID, tenant, organization) {
    return new Promise(function (resolve, reject) {
        sendRequest('get', 'https://my.jasminsoftware.com/api/' + tenant + '/' + organization + '/purchasesCore/purchasesItems', parseInt(companyID))
            .then(resJasmin => {
                resolve(resJasmin.data.map(a => a.itemKey));
            }).catch((err) => { console.log(err) });
    });
};

module.exports = router;
