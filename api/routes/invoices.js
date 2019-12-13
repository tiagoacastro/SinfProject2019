var { sendRequest } = require('./../utils/jasmin');

function postInvoices(orders, sellerCompany, buyerCompany) {
    postSalesInvoice(orders, sellerCompany, buyerCompany);
    postPurchasesInvoice(orders, sellerCompany, buyerCompany);
}

async function postSalesInvoice(orders, sellerCompany, buyerCompany) {
    console.log('sale invoice');
    /*
    for (let i = 0; i < orders.length; i++) {
        let invoiceBody = {

        };

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/227116/227116-0001/goodsreceipt/processOrders/WINEWARD', 2, invoiceBody);
        } catch (err) {
            console.log(err);
        }

    }
    */
}

async function postPurchasesInvoice(orders, sellerCompany, buyerCompany) {
    console.log('purchase invoice');
    /*
    for (let i = 0; i < orders.length; i++) {
        let invoiceBody = {

        };

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/227116/227116-0001/goodsreceipt/processOrders/WINEWARD', 2, invoiceBody);
        } catch (err) {
            console.log(err);
        }

    }
    */
}

module.exports = { postInvoices };