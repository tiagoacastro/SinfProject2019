var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const bodyParser = require('body-parser');
const { pool, connect, getClient } = require('./config')

var indexRouter = require('./routes/index');
var productsRouter = require("./routes/products");
var salesRouter = require("./routes/sales");
var purchasesRouter = require("./routes/purchases");
var entitiesRouter = require("./routes/entities");
var processesRouter = require("./routes/processes");
var logsRouter = require("./routes/logs");
var { getAcessToken } = require('./utils/jasmin');
var { sendRequest } = require('./utils/jasmin');
var { generateSalesOrder } = require('./utils/sales_jasmin');
var { generateGoodsReceipt } = require('./routes/deliveries');
var { generatePaymentReceipt } = require('./routes/payment');
var { log } = require('./routes/logs');
var { generateSalesInvoices, generatePurchasesInvoices } = require('./routes/invoices');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/entities', entitiesRouter);
app.use('/logs', logsRouter);
app.use('/processes', processesRouter);
app.use('/company/:companyID/sales', salesRouter);
app.use('/company/:companyID/purchases', purchasesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//---------------------------
//---------functions---------
//---------------------------

var companies;

async function initialize() {
    const client = await connect();

    let result = await client.query('SELECT * FROM companies');
    companies = result.rows;
    await getAcessToken(companies[0], companies[1]);
}


//---------------------------
//------------code-----------
//-------------------------
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}



const loopBody = async () => {

    const client = getClient();
    let result = await client.query('SELECT * FROM processes where active = true');

    let events = [];
    for (var i = 0; i < result.rows.length; i++) {
        let result2 = await client.query('SELECT events.* FROM processes_events, events WHERE processes_events.id_process = $1 and processes_events.id_event = events.id order by processes_events.position', [result.rows[i].id]);
        events.push(result2.rows);
    }

    await asyncForEach(events, async (event) => {
        await asyncForEach(event, async (e) => {
            if (e.method == "Automatic") {
                switch (e.document) {
                    case "Sales Order":
                        await generateSalesOrder(companies[e.issuing_company - 1], companies[2 - e.issuing_company]);
                        break;

                    case "Goods Receipt":
                        await generateGoodsReceipt(companies[2 - e.issuing_company], companies[e.issuing_company - 1]);
                        break;

                    case "Payment Receipt":
                        await generatePaymentReceipt(companies[e.issuing_company - 1], companies[2 - e.issuing_company]);
                        break;

                    case "Purchase Invoice":
                        await generatePurchasesInvoices(companies[2 - e.issuing_company], companies[e.issuing_company - 1]);
                        break;

                    case "Sales Invoice":
                        await generateSalesInvoices(companies[e.issuing_company - 1], companies[2 - e.issuing_company]);
                        break;

                    default:
                        break;

                }
            }
        })
    })
}

const loop = async () => {
    while (true) {
        loopBody();
        await new Promise(resolve => setTimeout(() => resolve(console.log("Looping again")), 15000));
    }
}


initialize().then(() => {
    loop();
});

module.exports = app;