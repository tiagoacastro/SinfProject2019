var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config');
var { log } = require('../utils/requests');

async function postPaymentsReceipts(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let paymentId = orders[i].id;

        let res = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [paymentId]);

        if (res.rows.length == 0) {
            let orderBodyArr = [];

            for (let j = 0; j < orders[i].documentLines.length; j++) {
                let salesInvoiceId = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE master_data.reference_' + buyerCompany.id + ' = $1', [orders[i].documentLines[j].sourceDocId]);

                if (salesInvoiceId.rows.length != 0) {
                    let id;

                    if (sellerCompany.id == 1) {
                        id = salesInvoiceId.rows[0].reference_1;
                    } else {
                        id = salesInvoiceId.rows[0].reference_2;
                    }

                    console.log(sellerCompany.id)
                    let salesInvoice = await sendRequest('get', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/billing/invoices/${id}`, sellerCompany.id);

                    orderBodyArr.push({
                        sourceDoc: salesInvoice.data.naturalKey,
                        discount: orders[i].documentLines[j].discountAmount,
                        settled: orders[i].documentLines[j].settledAmount.amount
                    });
                } else {
                    log(sellerCompany.id, 'Payment Receipt', false, "Error");

                    if (salesInvoiceId.rows.length == 0) {
                        return console.error("No sales invoice was found with the purchase invoice")
                    } else
                        return console.error(paymentId + ' - Error with order check')
                }
            }
            if (orderBodyArr.length != 0) {
                try {
                    let post_res = await sendRequest('post', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/accountsReceivable/processOpenItems/${sellerCompany.c_key}`, sellerCompany.id, orderBodyArr);
                    let paymentReceiptId = post_res.data;

                    await pool.query('INSERT INTO master_data (reference_' + sellerCompany.id + ', reference_' + buyerCompany.id + ', category) VALUES ($1, $2, $3)', [paymentReceiptId, paymentId, "Document"])
                    console.log('payment: ' + paymentId + ' - Doesnt exist, payment receipt was created on company ' + sellerCompany.id + ' with id: ' + paymentReceiptId)

                    log(sellerCompany.id, 'Payment Receipt', true, "id: " + paymentReceiptId);
                } catch (err) {
                    console.log(err);

                    log(sellerCompany.id, 'Payment Receipt', false, "Error");
                }
            }

        } else {
            if (res.rows.length == 1) {
                console.log('payment: ' + paymentId + ' - Already exists with id on company 1 being: ' + res.rows[0])

                log(sellerCompany.id, 'Payment Receipt', false, "Document already exists");
            } else {
                console.log(paymentId + ' - Error with order check');

                log(sellerCompany.id, 'Payment Receipt', false, "Error");
            }
        }
    }
}

async function generatePaymentReceipt(sellerCompany, buyerCompany) {
    console.log("generatePaymentReceipt");
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/accountsPayable/payments`, buyerCompany.id);
    var paymentOrderArr = res.data;
    var activePayment = paymentOrderArr.filter(payment => !payment.isDeleted);
    console.log(activePayment.length);
    postPaymentsReceipts(activePayment, sellerCompany, buyerCompany);
}

module.exports = { generatePaymentReceipt };