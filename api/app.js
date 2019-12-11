var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const bodyParser = require('body-parser');
const { pool } = require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var { getAcessToken } = require('./utils/jasmin');
var { sendRequest } = require('./utils/jasmin');
var { postSalesOrder } = require('./routes/sales');
var { getPurchaseOrders } = require('./routes/sales');

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
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);

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
    const client = await pool.connect();

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

//---------------------------
//------------code-----------
//---------------------------

testDB();

/*
getAcessToken();

setTimeout(function() {
    getPurchaseOrders();
}, 2000);
*/

module.exports = app;