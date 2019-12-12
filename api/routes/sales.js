var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('./config')

var router = express.Router();

router.get('/company/:companyID/sales', function (req, res, next) {
    const { id } = req.params;
    var data = sendRequest('get', 'https://my.jasminsoftware.com/api/224814/224814-0001/sales/orders', 1);
    console.log(data);
    res.send('respond with a resource');
});

async function postSalesOrder(orders) {
    for (let i = 0; i < orders.length; i++) {
        let purchaseOrderId = orders[i].orderId;
        let rows;
        await pool.query('SELECT id FROM master_data WHERE reference_2 = $1', [purchaseOrderId], (error, result) => {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }
            rows = result.rows;
        });
        if(rows.length == 0){
            let orderResource =
            {
                documentType: "ECL",
                serie: "2019",
                buyerCustomerParty: "0003",
                documentDate: "now",
                discount: orders[i].discount,
                currency: orders[i].currency,
                paymentMethod: orders[i].paymentMethod,
                paymentTerm: orders[i].paymentTerm,
                deliveryTerm: orders[i].deliveryTerm,
                salesChannel: "ONLINE",
                company: "SINF",
                remarks: "A sua encomenda totaliza <b>0 KG<\/b>, será despachada por <b>CTT Expresso 10<\/b> e o meio de pagamento escolhido é <b>Numerário<\/b>.",
                unloadingPoint: orders[i].unloadingPoint,
                unloadingStreetName: orders[i].unloadingStreetName,
                unloadingBuildingNumber: orders[i].unloadingBuildingNumber,
                unloadingPostalZone: orders[i].unloadingPostalZone,
                unloadingCityName: orders[i].unloadingCityName,
                unloadingCountry: orders[i].unloadingCountry,
                documentLines: [
                    {
                        salesItem: "GRAPE",
                        quantity: orders[i].documentLines[0].quantity,
                        unit: orders[i].documentLines[0].unit,
                        itemTaxSchema: "IVA-TR",
                        unitPrice: orders[i].documentLines[0].unitPrice
                    }
                ]
            }

            try {
                let res = await sendRequest('post', 'https://my.jasminsoftware.com/api/224814/224814-0001/sales/orders', 1, orderResource);
                let saleOrderId = res.data;

                await pool.query('INSERT INTO master_data (reference_1, reference_2, category) VALUES ($1, $2, "Document")', [saleOrderId, purchaseOrderId], (error, result) => {
                    if (error) {
                        return console.error('Error executing INSERT query', error.stack)
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    }
}

async function getPurchaseOrders() {
    let res = await sendRequest('get', 'https://my.jasminsoftware.com/api/227116/227116-0001/purchases/orders', 2);
    postSalesOrder(res.data);
}

module.exports = { router, getPurchaseOrders };
