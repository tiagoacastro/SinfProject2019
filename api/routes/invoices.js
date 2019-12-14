var { sendRequest } = require('./../utils/jasmin');

async function postSalesInvoice(orders, sellerCompany, buyerCompany) {
    console.log('sale invoice');

    for (let i = 0; i < orders.length; i++) {
        let deliveryOrderId = orders[i].id;
        await pool.query('SELECT document_2 FROM private_data WHERE id_company = $1 AND document_1 = $2', [sellerCompany.id, deliveryOrderId], async function (error, result) {
            if (error) {
                return console.error('Error executing SELECT query', error.stack)
            }

            let rows = result.rows;
            if (rows.length == 0) {
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
                    buyerCustomerPartyName: "Sofrio, Lda",
                    accountingPartyName: "Sofrio, Lda.",
                    accountingPartyTaxId: "593362462",
                    exchangeRate: 1,
                    discount: 0,
                    loadingCountry: "PT",
                    unloadingCountry: "PT",
                    isExternal: false,
                    isManual: false,
                    isSimpleInvoice: false,
                    isWsCommunicable: false,
                    deliveryTerm: "V-VIATURA",
                    documentLines: [{
                        salesItem: "ARECA",
                        description: "Palmeira areca em vaso grês",
                        quantity: 1,
                        unitPrice: {
                            "amount": 65,
                            "baseAmount": 65,
                            "reportingAmount": 65,
                            "fractionDigits": 2,
                            "symbol": "€"
                        },
                        unit: "UN",
                        itemTaxSchema: "IVA-TN",
                        deliveryDate: "2018-01-04T00:00:00"
                    }],
                    WTaxTotal: {
                        amount: 0,
                        baseAmount: 0,
                        reportingAmount: 0,
                        fractionDigits: 2,
                        symbol: "€"
                    },
                    TotalLiability: {
                        baseAmount: 0,
                        reportingAmount: 0,
                        fractionDigits: 2,
                        symbol: "€"
                    }
                }
            } else {
                if (rows.length == 1)
                    console.log(deliveryOrderId + ' - Already exists with id on company 1 being: ' + rows[0])
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

<<<<<<< HEAD
module.exports = { postPurchasesInvoice };
=======
module.exports = { postSalesInvoice };
>>>>>>> master
