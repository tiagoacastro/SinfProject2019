var { getClient } = require('../config');

async function getCompanyInformation(companyID) {
    const client = getClient();

    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM companies where id=${companyID}`)
            .then(result => {
                resolve({ tenant: result.rows[0].tenant, organization: result.rows[0].organization });
            }).catch((err) => { console.error('Error executing SELECT query', err.stack) });
    });
};

async function getCompaniesInformation() {
    const client = getClient();

    return client.query(`SELECT * FROM companies`);
};


async function getMappedProducts() {
    const client = getClient();
    return client.query('SELECT id, reference_1, reference_2 FROM master_data where category=\'Product\'');
}

async function getMappedEntities() {
    const client = getClient();
    return client.query('SELECT * FROM master_data where category::text LIKE \'%Entity\'');
}

async function log(company, document, success, message) {
    const client = getClient();
    var currentdate = new Date();
    var timestamp = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate() + ' ' +
        currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    await client.query('INSERT INTO logs (moment, id_company, document, success, message) VALUES ($1, $2, $3, $4, $5)', [timestamp, company, document, success, message])
}


module.exports = { getCompanyInformation, getCompaniesInformation, getMappedProducts, getMappedEntities, log };
