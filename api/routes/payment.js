var express = require('express');
var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function postPaymentsReceipts(orders, sellerCompany, buyerCompany) {
    for (let i = 0; i < orders.length; i++) {
        let paymentId = orders[i].id;

        await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [paymentId], async function (error, result) {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }

            let rows = result.rows;
            if (rows.length == 0) {

                /*let orderBody = {
                    SourceDoc: ,
                    SourceDocLineNumber: orders[i].documentLines[0].sourceDocLine,
                    quantity: orders[i].documentLines[0].quantity
                }; */


            } else {
                if (rows.length == 1)
                    console.log(paymentId + ' - Already exists with id on company 1 being: ' + rows[0])
                else
                    console.log(paymentId + ' - Error with order check')
            }

        });
    }
}

async function getPayments(sellerCompany, buyerCompany) {
    let res = await sendRequest('get', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/accountsPayable/payments`, buyerCompany.id);
    console.log(res);
    // postPaymentsReceipts(res.data, sellerCompany, buyerCompany);
}

module.exports = { getPayments };