var ejs 	= require('ejs');
var mongo	= require("./mongo");
var ObjectId= require('mongodb').ObjectID;

var winston = require('winston');
var fs 		= require('fs');
var logDir	= 'log';
var env 	= process.env.NODE_ENV || 'development';

var mongoURL= "mongodb://localhost:27017/EbayDatabaseMongoDB";


var tsFormat = (new Date()).toLocaleTimeString();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: 'log/bid.log',
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});
logger.info('Hello bid');
logger.warn('Warning bid');

setInterval(function(){
	//console.log('inside new setInterval');
	logger.debug('inside bid');
	 var currentTime = Math.floor(Date.now() / 1000);
	 
	 
		mongo.connect(mongoURL, function() {

			var collection_bid = mongo.collection('bid');
			var collection_bought = mongo.collection('bought');	
			
			collection_bid.find({
				session_end_time : {$lte : currentTime}
			}).toArray(function(err, result){
				
				var length = result.length;
				
				if(length !== 0){
					console.log(result);
				    
					var bought_product_id = result[0]._id;
				    var bought_product_name = result[0].product_name;
				    var bought_product_desc = result[0].product_desc;
				    var bought_product_original_price = result[0].product_price;
				    var bought_product_original_owner = result[0].username;
				    var bought_product_original_owner_fname = result[0].product_owner_fname;
				    var bought_product_original_owner_lname = result[0].product_owner_lname;
				    var bought_product_original_owner_location = result[0].product_owner_location;
				    var bought_product_original_owner_contact_info = result[0].product_owner_contact_info;
				    
				    var bought_product_owner = result[0].current_highest_bidder;
				    var bought_product_price = result[0].current_highest_bid;
				    
				    collection_bought.insert({
				    	bought_product_name : bought_product_name,
				    	bought_product_desc : bought_product_desc,
				    	bought_product_original_price : bought_product_original_price,
				    	bought_product_original_owner : bought_product_original_owner,
				    	bought_product_original_owner_fname : bought_product_original_owner_fname,
				    	bought_product_original_owner_lname : bought_product_original_owner_lname,
				    	bought_product_original_owner_location : bought_product_original_owner_location,
				    	bought_product_original_owner_contact_info : bought_product_original_owner_contact_info,
				    	bought_product_owner : bought_product_owner,
				    	bought_product_price : bought_product_price

					}, function(err, user) {
						if (user) {
							console.log("SUCCESS!");
							logger.debug('bid completed');

						} else {
							console.log("FAILURE!");
							logger.debug('bid failed');
						}
					});
				    
				    collection_bid.remove({
				    	_id : bought_product_id

					}, function(err, user) {
						if (user) {
							console.log("SUCCESS!");
							logger.debug('bid removed from bid table');

						} else {
							console.log("FAILURE!");
							logger.debug('bid removal from bid table failed');
						}
					});
					
				}
			    
			})
		});

}, 10000)
