var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config');
var { log } = require('../utils/requests');

async function postSalesOrder(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let purchaseOrderId = orders[i].documentLines[0].orderId;
        let result = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [purchaseOrderId])

        let rows = result.rows;
        if (rows.length == 0) {
            let lines = orders[i].documentLines;
            let dl = [];

            for (let i = 0; i < lines.length; i++) {
                let res = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [lines[i].purchasesItem]);
                if (res.rows.length != 1) {
                    log(sellerCompany.id, 'Sales Order', false, "Error gettomg data for: " + lines[i].purchasesItem);

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

            let ans = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE category = $1', ['Customer_Entity']);
            let party;
            if (ans.rows.length != 1) {
                log(sellerCompany.id, 'Sales Order', false, "Error getting costumer entity");

                return console.error('Error getting master data for customer entity');
            }

            if (buyerCompany.id == 1) {
                party = ans.rows[0].reference_1;
            } else {
                party = ans.rows[0].reference_2;
            }

            let orderResource = {
                documentType: "ECL",
                serie: "2019",
                buyerCustomerParty: party,
                documentDate: "now",
                discount: orders[i].discount,
                currency: orders[i].currency,
                paymentMethod: orders[i].paymentMethod,
                paymentTerm: orders[i].paymentTerm,
                deliveryTerm: orders[i].deliveryTerm,
                salesChannel: "ONLINE",
                company: sellerCompany.c_key,
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

                await pool.query('INSERT INTO master_data (reference_1, reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, "Document"]);
                console.log('purchase order: ' + purchaseOrderId + ' - Doesnt exist, sales order was created on company ' + sellerCompany.id + ' with id: ' + saleOrderId)

                log(sellerCompany.id, 'Sales Order', true, "id: " + saleOrderId);
            } catch (err) {
                console.log(err);

                log(sellerCompany.id, 'Sales Order', false, "Error");
            }
        } else {
            if (rows.length == 1) {
                let id;

                if (sellerCompany.id == 1) {
                    id = rows[0].reference_1;
                } else {
                    id = rows[0].reference_2;
                }

                console.log('purchase order: ' + purchaseOrderId + ' - Already exists with id on company ' + sellerCompany.id + ' being: ' + id)

                log(sellerCompany.id, 'Sales Order', false, "Document already exists");
            } else {
                console.log('purchase order: ' + purchaseOrderId + ' - Error with order check')

                log(sellerCompany.id, 'Sales Order', false, "Error");
            }
        }
    }
}

async function generateSalesOrder(sellerCompany, buyerCompany) {
    console.log("generateSalesOrder");
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/purchases/orders`, buyerCompany.id);
    var purchaseOrderArr = res.data;
    var activeOrder = purchaseOrderArr.filter(order => !order.isDeleted);
    var activeOrder2 = activeOrder.filter(order => !order.autoCreated);
    await postSalesOrder(activeOrder2, sellerCompany, buyerCompany);
}


module.exports = { generateSalesOrder };