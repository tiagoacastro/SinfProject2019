var { sendRequest } = require('./../utils/jasmin');

async function postGoodsReceipt(orders) {
    for (let i = 0; i < orders.length; i++) {
        let orderBody = {
            SourceDocKey: orders[i].sourceDoc,
            SourceDocLineNumber: orders[i].SourceDocLine,
            quantity: orders[i].quantity
        };

        try {
            var data = await sendRequest('post', 'https://my.jasminsoftware.com/api/227116/227116-0001/goodsreceipt/processOrders/WINEWARD', 2, orderBody);
        } catch (err) {
            console.log(err);
        }

    }
}

async function getDeliveryOrders() {
    let res = await sendRequest('get', 'https://my.jasminsoftware.com/api/224814/224814-0001/shipping/deliveries', 1);
    postGoodsReceipt(res.data);
}

module.exports = {getDeliveryOrders};
