var { sendRequest } = require('./../utils/jasmin');
const { pool } = require('../config')

async function log(company, document, success, message) {
    var currentdate = new Date();
    var timestamp = currentdate.getFullYear() + '-' + (currentdate.getMonth() + 1) + '-' + currentdate.getDate() + ' ' +
        currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    await pool.query('INSERT INTO logs (moment, id_company, document, success, message) VALUES ($1, $2, $3, $4, $5)', [timestamp, company, document, success, message])
}

module.exports = { log };