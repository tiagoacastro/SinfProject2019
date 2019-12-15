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
                let purchaseInvoiceId = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [orders[i].documentLines[j].sourceDocId]);

                if (purchaseInvoiceId.rows.length != 0) {

                    let result = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/invoiceReceipt/invoices/${purchaseInvoiceId.rows[0].reference_2}`, buyerCompany.id);
                    console.log(result.data);

                    orderBodyArr.push({
                        SourceDoc: 123,
                        SourceDocLineNumber: orders[i].documentLines[0].sourceDocLine,
                        quantity: orders[i].documentLines[0].quantity
                    });
                } else {
                        if (purchaseInvoiceId.rows.length == 0)
                            console.log("No purchase invoice was found with the sales invoice order sourceid")
                        else
                            console.log(deliveryOrderId + ' - Error with order check')
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
    postPaymentsReceipts(paymentOrderArr, sellerCompany, buyerCompany);
}

module.exports = { getPayments };