var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');

// URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/EbayDatabaseMongoDB";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSession);
var mongo = require("./routes/mongo");

var saltRounds = 10;

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
	secret : 'cmpe273_test_string',
	resave : false, // don't save session if unmodified
	saveUninitialized : false, // don't create session until something stored
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
	store : new mongoStore({
		url : mongoSessionConnectURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// GET
app.get('/', home.signin);
app.get('/home', home.signin);
app.get('/profile', home.profile);
app.get('/successLogin', home.redirectToHomepage);
app.get('/getAllProducts', home.getAllProducts);
app.get('/managesellitems', home.managesellitems);
app.get('/managebiditems', home.managebiditems);
app.get('/yourCart', home.yourCart);
app.get('/getAllBids', home.getAllBids);
app.get('/boughthistory', home.boughthistory);
app.get('/soldhistory', home.soldhistory);
// POST
app.post('/afterSignIn', home.afterSignIn);
app.post('/updateProfile', home.updateProfile);
app.post('/submitAd', home.submitAd);
app.post('/cart', home.cart);
app.post('/removeCart', home.removeCart);
app.post('/submitBid', home.submitBid);
app.post('/bid', home.bid);
app.post('/removeYourBidAD', home.removeYourBidAD);
app.post('/registerNewUser', home.registerNewUser);
app.post('/payment', home.payment);
app.post('/logout', home.logout);

// connect to the mongo collection session and then createServer

mongo.connect(mongoSessionConnectURL, function() {
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});
});
