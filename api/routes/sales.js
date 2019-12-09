var express = require('express');

var { sendRequest } = require('./../utils/jasmin');

var router = express.Router();

router.get('/company/:companyID/sales', function(req, res, next) {
    const {id} = req.params; 
    var data = sendRequest('get', 'https://my.jasminsoftware.com/api/224814/224814-0001/sales/orders',1 );
    console.log(data);
    res.send('respond with a resource');
});

async function postSalesOrder(orders) {
    for(let i=0; i < orders.length; i++) {
        let orderResource = 
        {
            company: "SINF",
            buyerCustomerParty: "0003",
            deliveryOnInvoice: true,
            deliveryTerm: orders[i].deliveryTerm,
            documentLines: [
                {
                  salesItem: "GRAPE"
                  /*quantity: orders[i].documentLines[0].quantity,
                  unit: orders[i].documentLines[0].unit,
                  itemTaxSchema:"IVA-TR",
                  unitPrice: orders[i].documentLines[0].unitPrice*/
                }]
        }

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/224814/224814-0001/sales/orders', 1, orderResource);
         } catch(err) {
             console.log(err);
         }
    }

  
}

async function getPurchaseOrders() {
    let res = await sendRequest('get', 'https://my.jasminsoftware.com/api/227116/227116-0001/purchases/orders', 2 );
    postSalesOrder(res.data); 
}

module.exports = {router, postSalesOrder, getPurchaseOrders};
