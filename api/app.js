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
var { getAcessToken } = require('./utils/jasmin');
var { sendRequest } = require('./utils/jasmin');
var { getPurchaseOrders } = require('./routes/sales');
var { getDeliveryOrders } = require('./routes/deliveries');
var { getPayments } = require('./routes/payment');
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
//app.use('/company/:companyID/sales', salesRouter);
app.use('/company/:companyID/purchases', purchasesRouter);
app.use('/processes', processesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
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

async function testDB() {
    const client = await connect();

    //example query insert
    await client.query('INSERT INTO processes (name) VALUES ($1)', ['test'], (error, result) => {
        if (error) {
            return console.error('Error executing INSERT query', error.stack)
        }
        console.log('added')
    });

    //example query select
    await client.query('SELECT id, name FROM processes', (error, result) => {
        if (error) {
            return console.error('Error executing SELECT query', error.stack)
        }
        console.log(result.rows)
    });

    //example query delete
    await client.query('DELETE FROM processes', (error, result) => {
        if (error) {
            return console.error('Error executing DELETE query', error.stack)
        }
        console.log('deleted')
    });
}

var companies;

async function initialize() {
    const client = await connect();

    client.query('SELECT * FROM companies', (error, result) => {
        if (error) {
            console.error('Error executing SELECT query', error.stack)
        }
        companies = result.rows;
        getAcessToken(companies[0], companies[1]);
    });
}


//---------------------------
//------------code-----------
//---------------------------

//testDB();

initialize();

setTimeout(function() {
    //getPurchaseOrders(companies[0], companies[1]);
    //getDeliveryOrders(companies[0], companies[1]);
}, 2000);



module.exports = app;