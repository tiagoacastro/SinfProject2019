require('dotenv').config()

const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    ssl: true,
});

let client;

async function connect() {
    client = await pool.connect();
    console.log("Connection with database established.\n");
    return client;
}

function getClient() {
    return client;
}

module.exports = { pool, connect, getClient }