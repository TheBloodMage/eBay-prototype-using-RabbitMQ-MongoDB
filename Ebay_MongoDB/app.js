var express = require('express');
var routes 	= require('./routes');
var user 	= require('./routes/user');
var http 	= require('http');
var path 	= require('path');
var home 	= require('./routes/home');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/EbayDatabaseMongoDB";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSession);
var mongo = require("./routes/mongo");


//var session = require('client-sessions');
const winston = require('winston');
const fs 	= require('fs');
const env 	= process.env.NODE_ENV || 'development';
const logDir= 'log';


const tsFormat = (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'log/results.log',
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});
/*logger.info('Hello world');
logger.warn('Warning message');*/

logger.debug('Debugging info');

const
saltRounds = 10;

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());


app.use(expressSession({
	secret: 'cmpe273_test_string',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//GET
app.get('/'					, home.signin);
app.get('/home'				, home.signin);
app.get('/profile'			, home.profile);
app.get('/getAllProducts'	, home.getAllProducts);
app.get('/managesellitems'	, home.managesellitems);
app.get('/yourCart'			, home.yourCart);
app.get('/getAllBids'		, home.getAllBids);
//POST
app.post('/afterSignIn'		, home.afterSignIn);
app.post('/updateProfile'	, home.updateProfile);
app.post('/submitAd'		, home.submitAd);
app.post('/cart'			, home.cart);
app.post('/removeCart'		, home.removeCart);
app.post('/submitBid'		, home.submitBid);
app.post('/bid'				, home.bid);



app.post('/registerNewUser', home.registerNewUser);


app.post('/money', home.money);
app.post('/logout', home.logout);


app.post('/removeAd', home.removeAd);

app.get('/getAllBoughtProducts', home.getAllBoughtProducts);
app.get('/successLogin', home.redirectToHomepage);


app.get('/calculate', home.calculate)

//connect to the mongo collection session and then createServer

mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
