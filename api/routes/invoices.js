var { sendRequest } = require('./../utils/jasmin');

async function postSalesInvoice(orders, sellerCompany, buyerCompany) {
    console.log('sale invoice');

    for (let i = 0; i < orders.length; i++) {
        let deliveryOrderId = orders[i].id;
        await pool.query('SELECT document_2 FROM private_data WHERE id_company = $1 AND document_1 = $2', [sellerCompany.id, deliveryOrderId], async function(error, result) {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }

            let rows = result.rows;
            if (rows.length == 0) {
                let lines = orders[i].documentLines
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

                let invoiceResource = {
                    documentType: "FA",
                    serie: orders[i].serie,
                    seriesNumber: orders[i].documentLines[0].seriesNumber,
                    company: orders[i].company,
                    paymentTerm: orders[i].paymentTerm,
                    paymentMethod: orders[i].paymentMethod,
                    currency: orders[i].currency,
                    documentDate: "now",
                    postingDate: "now",
                    buyerCustomerParty: buyerCompany.client_id,
                    buyerCustomerPartyName: buyerCompany.name,
                    accountingPartyName: orders[i].accountingPartyName,
                    accountingPartyTaxId: orders[i].accountingPartyTaxId,
                    exchangeRate: orders[i].exchangeRate,
                    discount: orders[i].discount,
                    loadingCountry: orders[i].loadingCountry,
                    unloadingCountry: orders[i].unloadingCountry,
                    isExternal: orders[i].isExternal,
                    isManual: orders[i].isManual,
                    isSimpleInvoice: false,
                    isWsCommunicable: orders[i].isWsCommunicable,
                    deliveryTerm: orders[i].deliveryTerm,
                    documentLines: dl
                }
            } else {
                if (rows.length == 1)
                    console.log(deliveryOrderId + ' - Already exists with id on company ' + sellerCompany.id + ' being: ' + rows[0])
                else
                    console.log(deliveryOrderId + ' - Error with order check')
            }
        });
    }

    postPurchasesInvoice(orders, sellerCompany, buyerCompany);
}

async function postPurchasesInvoice(salesInvoice, sellerCompany, buyerCompany) {
    console.log('purchase invoice');
}

module.exports = { postSalesInvoice };