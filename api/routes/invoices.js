var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function postSalesInvoice(order, sellerCompany, buyerCompany) {
    let deliveryOrderId = order.id;
    let result = await pool.query('SELECT document_2 FROM private_data WHERE id_company = $1 AND document_1 = $2', [sellerCompany.id, deliveryOrderId]);

    let rows = result.rows;
    if (rows.length == 0) {
        let lines = order.documentLines
        let dl = [];

        for (let i = 0; i < lines.length; i++) {
            dl.push({
                salesItem: lines[i].item,
                description: lines[i].description,
                quantity: lines[i].quantity,
                unitPrice: lines[i].unitCost,
                unit: lines[i].unit,
                itemTaxSchema: lines[i].itemTaxSchema,
                deliveryDate: lines[i].deliveryDate
            });
        }

        let ans = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE category = $1', ['Customer_Entity']);
        let party;
        if (ans.rows.length != 1) {
            return console.error('Error getting master data for customer entity');
        }

        if (buyerCompany.id == 1) {
            party = ans.rows[0].reference_1;
        } else {
            party = ans.rows[0].reference_2;
        }

        let invoiceResource = {
            documentType: "FA",
            serie: "2019",
            seriesNumber: order.documentLines[0].seriesNumber,
            company: order.company,
            paymentTerm: order.paymentTerm,
            paymentMethod: order.paymentMethod,
            currency: order.currency,
            documentDate: "now",
            postingDate: "now",
            buyerCustomerParty: party,
            buyerCustomerPartyName: buyerCompany.name,
            exchangeRate: order.exchangeRate,
            discount: order.discount,
            loadingCountry: order.loadingCountry,
            unloadingCountry: order.unloadingCountry,
            isExternal: order.isExternal,
            isManual: order.isManual,
            isSimpleInvoice: false,
            isWsCommunicable: order.isWsCommunicable,
            deliveryTerm: order.deliveryTerm,
            documentLines: dl
        }

        try {
            let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/billing/invoices`, sellerCompany.id, invoiceResource);
            let invoiceId = res.data;

            await pool.query('INSERT INTO private_data (id_company, document_1, document_2) VALUES ($1, $2, $3)', [sellerCompany.id, deliveryOrderId, invoiceId])
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Doesnt exist, invoice was created on company ' + sellerCompany.id + ' with id: ' + invoiceId)
        } catch (err) {
            console.log(err);
        }
    } else {
        if (rows.length == 1)
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Already exists with id on company ' + sellerCompany.id + ' being: ' + rows[0].document_2)
        else
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Error with order check')
    }


    await postPurchasesInvoice(order, sellerCompany, buyerCompany);
}

async function postPurchasesInvoice(salesInvoice, sellerCompany, buyerCompany) {
    console.log('purchase invoice');
}

module.exports = { postSalesInvoice };