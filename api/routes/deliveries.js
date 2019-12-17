var { sendRequest } = require('./../utils/jasmin');
var { log } = require('../utils/requests');
const { pool } = require('../config');

async function postGoodsReceipt(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let deliveryOrderId = orders[i].id;
        let res = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + '= $1', [deliveryOrderId])
        if (res.rows.length == 0) {

            let res2 = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + '= $1', [orders[i].documentLines[0].sourceDocId])

            if (res2.rows.length != 0) {

                let id;

                if (buyerCompany.id == 1) {
                    id = res2.rows[0].reference_1;
                } else {
                    id = res2.rows[0].reference_2;
                }

                let result = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/purchases/orders/${id}`, buyerCompany.id);

                let orderBody = [];
                for (var j = 0; j < orders[i].documentLines.length; j++) {

                    orderBody.push({
                        SourceDocKey: result.data.naturalKey,
                        SourceDocLineNumber: orders[i].documentLines[j].sourceDocLine,
                        quantity: orders[i].documentLines[j].quantity
                    });
                }

                try {
                    let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/goodsReceipt/processOrders/${buyerCompany.c_key}`, buyerCompany.id, orderBody);
                    let goodsReceiptId = res.data;

                    await pool.query('INSERT INTO master_data (reference_' + sellerCompany.id + ', reference_' + buyerCompany.id + ', category) VALUES ($1, $2, $3)', [deliveryOrderId, goodsReceiptId, "Document"])
                    console.log('delivery order: ' + deliveryOrderId + ' - Doesnt exist, goods receipt was created on company ' + buyerCompany.id + ' with id: ' + goodsReceiptId)

                    log(buyerCompany.id, 'Goods Receipt', true, "id: " + goodsReceiptId);
                } catch (err) {
                    console.log(err);

                    log(buyerCompany.id, 'Goods Receipt', false, "Error");
                }
            } else {
                if (res2.rows.length == 0) {
                    console.log("No purchase order was found with the delivery order source sales order")

                    log(buyerCompany.id, 'Goods Receipt', false, "Error finding purchase order");
                } else {
                    console.log('delivery order: ' + deliveryOrderId + ' - Error with order check')

                    log(buyerCompany.id, 'Goods Receipt', false, "Error");
                }
            }
        } else {
            if (res.rows.length == 1) {
                let id;

                if (buyerCompany.id == 1) {
                    id = res.rows[0].reference_1;
                } else {
                    id = res.rows[0].reference_2;
                }

                console.log('delivery order: ' + deliveryOrderId + ' - Already exists with id on company ' + buyerCompany.id + ' being: ' + id)

                log(buyerCompany.id, 'Goods Receipt', false, "Document already exists");
            } else {
                console.log('delivery order: ' + deliveryOrderId + ' - Error with order check')

                log(buyerCompany.id, 'Goods Receipt', false, "Error");
            }
        }
    }
}

async function generateGoodsReceipt(sellerCompany, buyerCompany) {
    console.log("generateGoodsReceipt");
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/shipping/deliveries`, sellerCompany.id);
    var deliveryOrderArr = res.data;
    var activeDelivery2 = deliveryOrderArr.filter(delivery => !delivery.isDeleted);
    var activeDelivery = activeDelivery2.filter(delivery => !delivery.autoCreated);
    await postGoodsReceipt(activeDelivery, sellerCompany, buyerCompany);
}

module.exports = { generateGoodsReceipt };