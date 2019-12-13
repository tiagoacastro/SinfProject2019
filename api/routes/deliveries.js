var { postSalesInvoice } = require('./invoices');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function postGoodsReceipt(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let deliveryOrderId = orders[i].id;
        await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [deliveryOrderId], async function(error, result) {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }

            let rows = result.rows;
            if (rows.length == 0) {

                await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + '= $1', [orders[i].documentLines[0].sourceDocId], async function(error, result2) {
                    if (error) {
                        return console.error('Error executing SELECT query', error.stack)
                    }

                    let rows2 = result2.rows;

                    if (rows2.length != 0) {

                        let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/purchases/orders/${rows2[0].reference_2}`, 2);

                        let orderBody = [{
                            SourceDocKey: res.data.naturalKey,
                            SourceDocLineNumber: orders[i].documentLines[0].sourceDocLine,
                            quantity: orders[i].documentLines[0].quantity
                        }];

                        console.log(orderBody);
                        console.log(`https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/goodsReceipt/processOrders/WINEWARD`)

                        try {
                            let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/goodsReceipt/processOrders/WINEWARD`, 2, orderBody);
                            let goodsReceiptId = res.data;

                            await pool.query('INSERT INTO master_data (reference_' + sellerCompany.id + ', reference_' + buyerCompany.id + ', category) VALUES ($1, $2, $3)', [deliveryOrderId, goodsReceiptId, "Document"], (error, result) => {
                                if (error) {
                                    return console.error('Error executing INSERT query', error.stack)
                                } else {
                                    console.log(deliveryOrderId + ' - Doesnt exist, sales order was created on company 1 with id: ' + goodsReceiptId)
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        if (rows2.length == 0)
                            console.log("No purchase order was found with the delivery order source sales order")
                        else
                            console.log(deliveryOrderId + ' - Error with order check')
                    }


                })
            } else {
                if (rows.length == 1)
                    console.log(deliveryOrderId + ' - Already exists with id on company 1 being: ' + rows[0])
                else
                    console.log(deliveryOrderId + ' - Error with order check')
            }
        });
    }
}

async function getDeliveryOrders(sellerCompany, buyerCompany) {
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/shipping/deliveries`, 1);
    var deliveryOrderArr = res.data;
    var activeDelivery = deliveryOrderArr.filter(delivery => !delivery.isDeleted);

    postGoodsReceipt(activeDelivery, sellerCompany, buyerCompany);
    //postSalesInvoice(activeDelivery, sellerCompany, buyerCompany);
}

module.exports = { getDeliveryOrders };