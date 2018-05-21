
var express = require('express');
var router = express.Router();
var Base64 = require('js-base64').Base64;

var dbController = require('./db-handler.js')


// Home page route.
router.get('/', function (req, res) {
    console.log("Received get request")
    res.send('Wiki home page');
})

// About page route.
router.get('/about', function (req, res) {
    res.send('This is Telegramalyzer.com');
})

router.post('/stats', function (req, res, next) {
    console.log("Received post request to /stats")
    try {
        // 
        req.parsedChart = JSON.parse(req.body.dataO)
        next()
    } catch (error) {
        console.log("There seems to be something wrong with the data the server received")
        console.log(error)
        res.send("Invalid data")
    }


}, dbController.saveStatsToDB, dbController.returnID
)

router.get('/stats/:id', function (req, res, next) { console.log("Received get request"); next() }, dbController.returnStats)



module.exports = router;