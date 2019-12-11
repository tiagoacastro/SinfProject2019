var { sendRequest } = require('./../utils/jasmin');

function postInvoices(orders) {
    postSalesInvoice();
    postPurchasesInvoice();
}

async function postSalesInvoice() {
    for (let i = 0; i < orders.length; i++) {
        let invoiceBody = {
           
        };

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/227116/227116-0001/goodsreceipt/processOrders/WINEWARD', 2, invoiceBody);
        } catch (err) {
            console.log(err);
        }

    }
}

async function postPurchasesInvoice() {
    for (let i = 0; i < orders.length; i++) {
        let invoiceBody = {
           
        };

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/227116/227116-0001/goodsreceipt/processOrders/WINEWARD', 2, invoiceBody);
        } catch (err) {
            console.log(err);
        }

    }
}

module.exports = {postInvoices};
