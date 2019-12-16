var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function postPaymentsReceipts(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let paymentId = orders[i].id;

        let res = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE reference_' + buyerCompany.id + ' = $1', [paymentId]);

        if (res.rows.length == 0) {
            let orderBodyArr = [];

            for (let j = 0; j < orders[i].documentLines.length; j++) {
                let salesInvoiceId = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE master_data.reference_' + buyerCompany.id + ' = $1', [orders[i].documentLines[j].sourceDocId]);

                if (salesInvoiceId.rows.length != 0) {
                    let salesInvoice = await sendRequest('get', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/billing/invoices/${salesInvoiceId.rows[0].reference_1}`, sellerCompany.id);
                   
                    orderBodyArr.push({
                        sourceDoc: salesInvoice.data.naturalKey,
                        discount: orders[i].documentLines[j].discountAmount,
                        settled: orders[i].documentLines[j].settledAmount.amount
                    });
                } else {
                    if (salesInvoiceId.rows.length == 0)
                        console.log("No sales invoice was found with the purchase invoice")
                    else
                        console.log(deliveryOrderId + ' - Error with order check')
                }
            }
            if(orderBodyArr.length != 0) {
                try {
                    console.log(orderBodyArr);
                    let post_res = await sendRequest('post', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/accountsReceivable/processOpenItems/${sellerCompany.c_key}`, sellerCompany.id, orderBodyArr);
                    let paymentReceiptId = post_res.data;
    
                    await pool.query('INSERT INTO master_data (reference_' + sellerCompany.id + ', reference_' + buyerCompany.id + ', category) VALUES ($1, $2, $3)', [paymentReceiptId, paymentId, "Document"])
                    console.log('payment: ' + paymentId + ' - Doesnt exist, payment receipt was created on company ' + sellerCompany.id + ' with id: ' + paymentReceiptId)
                } catch (err) {
                    console.log(err);
                }
            }
            
        } else {
            if (res.rows.length == 1)
                console.log(paymentId + ' - Already exists with id on company 1 being: ' + res.rows[0])
            else
                console.log(paymentId + ' - Error with order check')
        }
    }
}

async function getPayments(sellerCompany, buyerCompany) {
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/accountsPayable/payments`, buyerCompany.id);
    var paymentOrderArr = res.data;
    var activePayment = paymentOrderArr.filter(payment => !payment.isDeleted);
    postPaymentsReceipts(activePayment, sellerCompany, buyerCompany);
}

module.exports = { getPayments };