var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')
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
    } catch (err) { res.sendStatus(400) }
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

async function postSalesOrder(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let purchaseOrderId = orders[i].documentLines[0].orderId;
        pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [purchaseOrderId], async function(error, result) {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }

            let rows = result.rows;
            if (rows.length == 0) {
                let lines = orders[i].documentLines;
                let dl = [];

                for (let i = 0; i < lines.length; i++) {
                    let res = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [lines[i].purchasesItem]);
                    if (res.rows.length != 1) {
                        console.log(lines[i].purchasesItem);
                        return console.error('Error getting master data for product');
                    } else {
                        let item;
                        if (sellerCompany.id == 1) {
                            item = res.rows[0].reference_1;
                        } else {
                            item = res.rows[0].reference_2;
                        }
                        dl[i] = {
                            salesItem: item,
                            quantity: lines[i].quantity,
                            unit: lines[i].unit,
                            itemTaxSchema: lines[i].itemTaxSchema,
                            unitPrice: lines[i].unitPrice
                        };
                    }
                }

                let orderResource = {
                    documentType: "ECL",
                    serie: "2019",
                    buyerCustomerParty: "0003", //ENTITY
                    documentDate: "now",
                    discount: orders[i].discount,
                    currency: orders[i].currency,
                    paymentMethod: orders[i].paymentMethod,
                    paymentTerm: orders[i].paymentTerm,
                    deliveryTerm: orders[i].deliveryTerm,
                    salesChannel: "ONLINE",
                    company: "SINF", //KEY
                    remarks: "order",
                    unloadingPoint: orders[i].unloadingPoint,
                    unloadingStreetName: orders[i].unloadingStreetName,
                    unloadingBuildingNumber: orders[i].unloadingBuildingNumber,
                    unloadingPostalZone: orders[i].unloadingPostalZone,
                    unloadingCityName: orders[i].unloadingCityName,
                    unloadingCountry: orders[i].unloadingCountry,
                    documentLines: dl
                };

                try {
                    let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/sales/orders`, sellerCompany.id, orderResource);
                    let saleOrderId = res.data;

                    let reference_1, reference_2;
                    if (sellerCompany.id == 1) {
                        reference_1 = saleOrderId;
                        reference_2 = purchaseOrderId;
                    } else {
                        reference_1 = saleOrderId;
                        reference_2 = purchaseOrderId;
                    }

                    pool.query('INSERT INTO master_data (reference_1, reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, "Document"], (error, result) => {
                        if (error) {
                            return console.error('Error executing INSERT query', error.stack)
                        } else {
                            console.log(purchaseOrderId + ' - Doesnt exist, sales order was created on company' + sellerCompany.id + 'with id: ' + saleOrderId)
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            } else {
                if (rows.length == 1)
                    console.log(purchaseOrderId + ' - Already exists with id on company ' + sellerCompany.id + ' being: ' + rows[0])
                else
                    console.log(purchaseOrderId + ' - Error with order check')
            }
        });
    }
}

async function getPurchaseOrders(sellerCompany, buyerCompany) {
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/purchases/orders`, buyerCompany.id);
    var purchaseOrderArr = res.data;
    var activeOrder = purchaseOrderArr.filter(order => !order.isDeleted);
    postSalesOrder(activeOrder, sellerCompany, buyerCompany);
}

module.exports = router;