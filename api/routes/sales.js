var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/company/:companyID/sales', function(req, res, next) {
    const {id} = req.params; 
    var data = sendRequest('get', 'http://my.jasminsoftware.com/api/224814/224814-0001/sales/orders');
    console.log(data);
    res.send('respond with a resource');
});

module.exports = router;
