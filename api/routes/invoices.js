var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function postSalesInvoice(order, sellerCompany, buyerCompany) {
    let deliveryOrderId = order.id;
    let result = await pool.query('SELECT document_2 FROM private_data WHERE id_company = $1 AND document_1 = $2', [sellerCompany.id, deliveryOrderId]);

    let rows = result.rows;

    if (rows.length == 0) {
        let ans = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE category = $1', ['Customer_Entity']);

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
            company: order.company,
            paymentTerm: order.paymentTerm,
            paymentMethod: order.paymentMethod,
            currency: order.currency,
            documentDate: "now",
            postingDate: "now",
            buyerCustomerParty: party,
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
            let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${sellerCompany.tenant}/${sellerCompany.organization}/billing/invoices/`, sellerCompany.id, invoiceResource);
            let invoiceId = res.data;

            await pool.query('INSERT INTO private_data (id_company, document_1, document_2) VALUES ($1, $2, $3)', [sellerCompany.id, deliveryOrderId, invoiceId])
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Doesnt exist, invoice was created on company ' + sellerCompany.id + ' with id: ' + invoiceId)

            await postPurchasesInvoice(invoiceId, order, sellerCompany, buyerCompany);
        } catch (err) {
            console.log(err);
        }
    } else {
        if (rows.length == 1) {
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Already exists with id on company ' + sellerCompany.id + ' being: ' + rows[0].document_2);

            await postPurchasesInvoice(rows[0].document_2, order, sellerCompany, buyerCompany);
        } else
            console.log('delivery order for invoice: ' + deliveryOrderId + ' - Error with order check')
    }
}


async function postPurchasesInvoice(salesInvoice, order, sellerCompany, buyerCompany) {
    let result = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [salesInvoice]);

    let rows = result.rows;
    if (rows.length == 0) {
        let dl = [];
        let lines = order.documentLines;

        for (let i = 0; i < lines.length; i++) {
            let res = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [lines[i].item]);
            if (res.rows.length != 1) {
                return console.error('Error getting master data for product');
            } else {
                let item;
                if (buyerCompany.id == 1) {
                    item = res.rows[0].reference_1;
                } else {
                    item = res.rows[0].reference_2;
                }
                dl.push({
                    purchasesItem: item,
                    quantity: lines[i].quantity,
                    unitPrice: lines[i].unitCost,
                });
            }
        }

        let ans = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE category = $1', ['Supplier_Entity']);
        let party;
        if (ans.rows.length != 1) {
            return console.error('Error getting master data for customer entity');
        }

        if (sellerCompany.id == 1) {
            party = ans.rows[0].reference_1;
        } else {
            party = ans.rows[0].reference_2;
        }

        let invoiceResource = {
            documentType: "VFA",
            serie: "2019",
            company: buyerCompany.c_key,
            paymentTerm: order.paymentTerm,
            paymentMethod: order.paymentMethod,
            currency: order.currency,
            documentDate: "now",
            postingDate: "now",
            sellerSupplierParty: party,
            exchangeRate: order.exchangeRate,
            discount: order.discount,
            loadingCountry: order.loadingCountry,
            unloadingCountry: order.unloadingCountry,
            deliveryTerm: order.deliveryTerm,
            documentLines: dl
        }

        try {
            let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/invoiceReceipt/invoices`, buyerCompany.id, invoiceResource);
            let invoiceId = res.data;

            let reference_1, reference_2;

            if (buyerCompany.id == 1) {
                reference_1 = invoiceId;
                reference_2 = salesInvoice;
            } else {
                reference_1 = salesInvoice;
                reference_2 = invoiceId;
            }

            await pool.query('INSERT INTO master_data (reference_1, reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, "Document"])
            console.log('sales invoice: ' + salesInvoice + ' - Doesnt exist, purchase invoice was created on company ' + buyerCompany.id + ' with id: ' + invoiceId)
        } catch (err) {
            console.log(err);
        }
    } else {
        if (rows.length == 1) {
            let id;

            if (buyerCompany.id == 1) {
                id = rows[0].reference_1;
            } else {
                id = rows[0].reference_2;
            }

            console.log('sales invoice: ' + salesInvoice + ' - Already exists with id on company ' + buyerCompany.id + ' being: ' + id);
        } else
            console.log('sales invoice: ' + salesInvoice + ' - Error with invoice check')
    }
}

//manual
async function postPurchasesInvoice(salesInvoice, sellerCompany, buyerCompany) {
    let result = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [salesInvoice.id]);

    let rows = result.rows;
    if (rows.length == 0) {
        let dl = [];
        let lines = salesInvoice.documentLines;

        for (let i = 0; i < lines.length; i++) {
            let res = await pool.query('SELECT reference_' + buyerCompany.id + ' FROM master_data WHERE reference_' + sellerCompany.id + ' = $1', [lines[i].salesItem]);
            if (res.rows.length != 1) {
                return console.error('Error getting master data for product');
            } else {
                let item;
                if (buyerCompany.id == 1) {
                    item = res.rows[0].reference_1;
                } else {
                    item = res.rows[0].reference_2;
                }
                dl.push({
                    purchasesItem: item,
                    quantity: lines[i].quantity,
                    unitPrice: lines[i].unitPrice,
                });
            }
        }

        let ans = await pool.query('SELECT reference_' + sellerCompany.id + ' FROM master_data WHERE category = $1', ['Supplier_Entity']);
        let party;
        if (ans.rows.length != 1) {
            return console.error('Error getting master data for customer entity');
        }

        if (sellerCompany.id == 1) {
            party = ans.rows[0].reference_1;
        } else {
            party = ans.rows[0].reference_2;
        }

        let invoiceResource = {
            documentType: "VFA",
            serie: "2019",
            company: buyerCompany.c_key,
            paymentTerm: salesInvoice.paymentTerm,
            paymentMethod: salesInvoice.paymentMethod,
            currency: salesInvoice.currency,
            documentDate: "now",
            postingDate: "now",
            sellerSupplierParty: party,
            exchangeRate: salesInvoice.exchangeRate,
            discount: salesInvoice.discount,
            loadingCountry: salesInvoice.loadingCountry,
            unloadingCountry: salesInvoice.unloadingCountry,
            deliveryTerm: salesInvoice.deliveryTerm,
            documentLines: dl
        }

        try {
            let res = await sendRequest('post', `https://my.jasminsoftware.com/api/${buyerCompany.tenant}/${buyerCompany.organization}/invoiceReceipt/invoices`, buyerCompany.id, invoiceResource);
            let invoiceId = res.data;

            let reference_1, reference_2;

            if (buyerCompany.id == 1) {
                reference_1 = invoiceId;
                reference_2 = salesInvoice;
            } else {
                reference_1 = salesInvoice;
                reference_2 = invoiceId;
            }

            await pool.query('INSERT INTO master_data (reference_1, reference_2, category) VALUES ($1, $2, $3)', [reference_1, reference_2, "Document"])
            console.log('sales invoice: ' + salesInvoice.id + ' - Doesnt exist, purchase invoice was created on company ' + buyerCompany.id + ' with id: ' + invoiceId)
        } catch (err) {
            console.log(err);
        }
    } else {
        if (rows.length == 1) {
            let id;

            if (buyerCompany.id == 1) {
                id = rows[0].reference_1;
            } else {
                id = rows[0].reference_2;
            }

            console.log('sales invoice: ' + salesInvoice.id + ' - Already exists with id on company ' + buyerCompany.id + ' being: ' + id);
        } else
            console.log('sales invoice: ' + salesInvoice.id + ' - Error with invoice check')
    }
}

module.exports = { postSalesInvoice };