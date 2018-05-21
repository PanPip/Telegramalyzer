var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

var handler = require('./router.js');



app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

var limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

//  apply to all requests
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:81');

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


if (process.env.TELEGRAMALYZER_DB_SERVICE_HOST) {

  var server_port =   process.env.TELEGRAMALYZER_DB_SERVICE_PORT_WEB
  //var server_ip_address = process.env.TELEGRAMALYZER_SERVER_SERVICE_HOST
  var server_ip_address = '0.0.0.0'

}
else{
  var server_port =  '127.0.0.1'
  var server_ip_address = 3000
}



app.listen(server_port, server_ip_address, function () {
  console.log("Listening on " + server_ip_address + ", port " + server_port)
});

// app.listen(3000, function() {
//     console.log('Example app listening on port 3000!');
//   });