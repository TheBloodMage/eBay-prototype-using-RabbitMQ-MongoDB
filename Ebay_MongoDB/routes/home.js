var ejs 		= require("ejs");
var mysql		= require('./mysql');
var bid 		= require('./bid');
var bcrypt 		= require('bcrypt');
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mq_client 	= require('../rpc/client');
var winston 	= require('winston');
var fs 			= require('fs');
var passport 	= require("passport");
var logDir		= 'log';
var env 		= process.env.NODE_ENV || 'development';
var mongoURL 	= "mongodb://localhost:27017/EbayDatabaseMongoDB";

var tsFormat 	= (new Date()).toLocaleTimeString();
var logger 		= new (winston.Logger)({
	transports: [
	             new (winston.transports.File)({
	            	 filename: 'log/results.log',
	            	 timestamp: tsFormat,
	            	 level: env === 'development' ? 'debug' : 'info'
	             })
	             ]
});

exports.signin = function(req, res) {

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
			console.log("successfully rendered the signin module");
			logger.info("successfully rendered the signin module");
		}
		// render or error
		else {
			res.end('An error occurred');
			logger.warn(err);
			console.log(err);
		}
	});
};

exports.registerNewUser = function(req, res) {
	
	var saltRounds = 10;
	var myPlaintextPassword = req.param("inputPassword");
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(myPlaintextPassword, salt);
	var dt = new Date();
	var first_name		= req.param("first_name");
	var last_name		= req.param("last_name");
	var inputUsername	= req.param("inputUsername");
	var inputPassword	= hash;
	
	var msg_payload = { 
			"saltRounds"			: saltRounds,
			"myPlaintextPassword"	: req.param("inputPassword"),
			"salt"					: bcrypt.genSaltSync(saltRounds),
			"hash"					: bcrypt.hashSync(myPlaintextPassword, salt),
			"dt"					: dt,
			"first_name"			: req.param("first_name"),
			"last_name"				: req.param("last_name"),
			"inputUsername"			: req.param("inputUsername"),
			"inputPassword"			: hash
	
	};
	
	console.log("ADDING A POST REQUEST register_new_user_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON register_new_user_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('register_new_user_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.profile = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON profile_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON profile_queue WITH msg_payload AS");
	logger.info(msg_payload);
	
	mq_client.make_request('profile_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.updateProfile = function(req, res) {
	
	var msg_payload = { 
			"fname"		: req.param("first_name"),
			"lname"		: req.param("last_name"),
			"birthday"	: req.param("bday"),
			"ebay_handle": req.param("ehandle"),
			"contact_info": req.param("cinfo"),
			"location"	: req.param("location"),
			"username"	: req.session.username
	
	};
	
	console.log("ADDING A POST REQUEST ON update_profile_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON update_profile_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('update_profile_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.getAllProducts = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON get_all_products_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON get_all_products_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('get_all_products_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.getAllBids = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON getAllBids WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON getAllBids WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('get_all_bids_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.submitAd = function(req, res) {
	
	var msg_payload = { 
			"product_name"	: req.param("product_name"),
			"product_desc"	: req.param("product_desc"),
			"product_price"	: req.param("product_price"),
			"tot_product"	: req.param("tot_product"),
			"username"		: req.session.username
	
	};
	
	console.log("ADDING A POST REQUEST ON submit_ad_queue WITH msg_payload AS:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON submit_ad_queue WITH msg_payload AS:");
	logger.info(msg_payload);
	
	mq_client.make_request('submit_ad_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.managesellitems = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON manage_sell_items_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON manage_sell_items_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('manage_sell_items_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.managebiditems = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON manage_bid_items_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON manage_bid_items_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('manage_bid_items_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.boughthistory = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON bought_history_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON bought_history_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('bought_history_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};


exports.soldhistory = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON sold_history_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON sold_history_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('sold_history_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};



exports.cart = function(req, res) {
	
	var msg_payload = { 
			"product_id": req.param("pid"),
			"username"	: req.session.username
	
	};
	
	console.log("ADDING A POST REQUEST ON cart_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON cart_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('cart_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.bid = function(req, res) {
	
	var msg_payload = { 
			"product_id" : req.param("pid"),
			"username"	 : req.session.username,
			"product_bid": req.param("product_bid")
	
	};
	
	console.log("ADDING A POST REQUEST ON bid_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON bid_queue QUEUE WITH msg_payload as:");
	logger.info(msg_payload);
	
	mq_client.make_request('bid_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
	
};

exports.yourCart = function(req, res) {
	
	var username = req.session.username;
	var msg_payload = { 
			"username": username
	};
	
	console.log("ADDING A POST REQUEST ON your_cart_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON your_cart_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('your_cart_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.removeCart = function(req, res) {
	
	var msg_payload = { 
			"username"	: req.session.username,
			"product_id": req.param("pid")
	};
	
	console.log("ADDING A POST REQUEST ON remove_cart_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON remove_cart_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('remove_cart_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.submitBid = function(req, res) {
	
	var sessionStartTime = Math.floor(Date.now() / 1000);
	//number of seconds in 4 days are 345600
	var sessionEndTime = sessionStartTime + 300;
	
	var msg_payload = { 
			"product_name"		: req.param("product_name"),
			"product_desc"		: req.param("product_desc"),
			"product_price"		: req.param("product_price"),
			"username"			: req.session.username,
			"sessionStartTime"	: sessionStartTime,
			"sessionEndTime"	: sessionEndTime
	
	};
	
	console.log("ADDING A POST REQUEST ON submit_bid_queue WITH msg_payload as:");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON submit_bid_queue WITH msg_payload as: ");
	logger.info(msg_payload);
	
	mq_client.make_request('submit_bid_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};


exports.removeYourBidAD = function(req, res) {
	
	var msg_payload = { 
			"username"	: req.session.username,
			"product_id": req.param("pid")
	};
	
	console.log("ADDING A POST REQUEST ON remove_your_bid_ad_queue WITH msg_payload AS: ");
	console.log(msg_payload);
	logger.info("ADDING A POST REQUEST ON remove_your_bid_ad_queue WITH msg_payload AS: ");
	logger.info(msg_payload);
	
	mq_client.make_request('remove_your_bid_ad_queue', msg_payload, function(err, results){
		console.log(results);
		if(err){
			throw err;
		}
		else {
			res.send(results);
		}  
	});
};

exports.payment = function(req, res){
	
	var json_responses;
	var msg_payload = { 
			"username"	 : req.session.username,
			"card_number": req.param("card_number")
	};
	
	console.log("ADDING A POST REQUEST ON payment_queue QUEUE WITH msg_payload as:");
	console.log(msg_payload.card_number.length);
	logger.info("ADDING A POST REQUEST ON payment_queue QUEUE WITH msg_payload as: ");
	logger.info(msg_payload);
	
	var card_number_length = msg_payload.card_number.length;
	
	if(card_number_length !== 16){
		json_responses = {
				"statusCode" : 401
		};
		res.send(json_responses);
	} else {
		json_responses = {
				"statusCode" : 200
		};
		res.send(json_responses);
	}
};

// Redirects to the homepage
exports.redirectToHomepage = function(req, res) {
	// Checks before redirecting whether the session is valid
	logger.info("Checks before redirecting whether the session is valid ");
	if (req.session.username) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("successLogin", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.logout = function(req, res) {
	console.log("in destroy session function");
	logger.info("in destroy session function");
	req.session.destroy();
	res.redirect('/');
};