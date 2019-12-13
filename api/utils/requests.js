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

module.exports = { getCompanyInformation, getCompaniesInformation };
