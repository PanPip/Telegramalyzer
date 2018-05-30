console.log("Attempting to start application")

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

var handler = require('./router.js');


app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

// var limiter = new RateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100000, // limit each IP to 100 requests per windowMs
//   delayMs: 0 // disable delaying - full speed until the max limit is reached
// });

// //  apply to all requests
// app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
  var allowedOrigins = ['https://telegramalyzer.com', 'https://www.telegramalyzer.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
});

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:81');
  // res.setHeader('Access-Control-Allow-Origin', 'https://telegramalyzer.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/', handler);


if (process.env.TELEG_SERVICE_PORT_WEB) {

  var server_port =   process.env.TELEG_SERVICE_PORT_WEB
  //var server_ip_address = process.env.TELEGRAMALYZER_SERVER_SERVICE_HOST
  var server_ip_address = '0.0.0.0'

  app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
  });

}
else{
  var server_port =  '127.0.0.1'
  var server_ip_address = 3000

  app.listen(server_ip_address, function() {
    console.log('Telegramalyzer server started');
  });
}





