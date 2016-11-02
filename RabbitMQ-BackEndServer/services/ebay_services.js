var ejs 		= require("ejs");
var mongo 		= require("./mongo");
var ObjectId 	= require('mongodb').ObjectID;
var mongoURL 	= "mongodb://localhost:27017/EbayDatabaseMongoDB";

exports.handle_register_new_user_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_register_new_user_queue_request:");

	var saltRounds 			= msg.saltRounds;
	var myPlaintextPassword = msg.myPlaintextPassword;
	var salt 				= msg.salt;
	var hash 				= msg.hash;
	var dt					= msg.dt;
	var first_name 			= msg.first_name;
	var last_name 			= msg.last_name;
	var inputUsername 		= msg.inputUsername;
	var inputPassword 		= msg.inputPassword;

	console.log("LISTENING TO handle_register_new_user_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_register_new_user_queue_request');
		
		var collection_login 	= mongo.collection('login');
		var collection_profile 	= mongo.collection('profile');
		var json_responses;

		collection_login.findOne({
			username : inputUsername
		}, function(err, user) {
			if (user) {
				console.log("USER ALREADY EXISTS");
				
				json_responses = {
					"statusCode" : 402
				};
				callback(null, json_responses);
			} else {
				collection_login.insert({
					username : inputUsername,
					password : hash,
					fname : first_name,
					lname : last_name,
					logintime : dt,
					currentlogintime : dt

				}, function(err, user) {
					if (user) {
						
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("RETURNED FALSE");
						
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});

				collection_profile.insert({
					username 	: inputUsername,
					password 	: hash,
					fname 		: first_name,
					lname 		: last_name,
					logintime 	: dt,
					currentlogintime : dt,
					birthday 	: "",
					ebay_handle : "",
					contact_info: "",
					location 	: ""

				}, function(err, user) {
					if (user) {
						
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("RETURNED FALSE");
						
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
			}

		});

	});

};


exports.handle_profile_queue_request = function (msg, callback) {

	console.log("IN handle_show_profile_queue_request:");
	console.log(msg);
	var json_responses = {};

	var username = msg.username;

	console.log("LISTENING TO A handle_show_profile_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_profile_queue_request');
		var coll = mongo.collection('profile');

		coll.findOne({
			username : username
		}, function(err, user) {
			if (user) {
				
				json_responses = {
					"users" : JSON.parse("[" + JSON.stringify(user) + "]")
				};
				
				console.log(json_responses);
				callback(null, json_responses);
			}
		});

	});

};

exports.handle_update_profile_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_update_profile_queue_request:");

	var fname 		= msg.fname;
	var lname 		= msg.lname;
	var birthday 	= msg.birthday;
	var ebay_handle = msg.ebay_handle;
	var contact_info= msg.contact_info;
	var location 	= msg.location;
	var username 	= msg.username;

	console.log("LISTENING TO handle_update_profile_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_update_profile_queue_request');
		var collection_profile = mongo.collection('profile');
		var collection_products = mongo.collection('products');

		collection_profile.update({
			username : username
		}, {
			$set : {
				birthday : birthday,
				ebay_handle : ebay_handle,
				contact_info : contact_info,
				location : location,
				fname : fname,
				lname : lname
			}
		},

		function(err, user) {
			if (user) {
				json_responses = {
					"statusCode" : 200
				};
				callback(null, json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				callback(null, json_responses);
			}
		});

		collection_products.updateMany({
			username : username
		}, {
			$set : {
				product_owner_fname : fname,
				product_owner_lname : lname,
				product_owner_location : location,
				product_owner_contact_info : contact_info
			}
		},

		function(err, user) {
			if (user) {
				json_responses = {
					"statusCode" : 200
				};
				console.log(json_responses);
				callback(null, json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				console.log(json_responses);
				callback(null, json_responses);
			}
		});

	});
};

exports.handle_get_all_products_queue_request = function (msg, callback) {

	console.log("IN handle_get_all_products_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_get_all_products_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_get_all_products_queue_request');

		var collection_products = mongo.collection('products');
		var json_response = {};
		
		collection_products.find({ 
			$and :
			[
			 { username : { $ne : username } },
			 { tot_product : {$ne : 0 } } 
			]
		}).toArray(function(err, items) {

			json_response = {
				"products" : items
			};
			
			console.log(json_response);
			callback(null, json_response);

		});
	});
};


exports.handle_get_all_bids_queue_request = function (msg, callback) {

	console.log("IN handle_get_all_bids_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_get_all_bids_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_get_all_bids_queue_request');

		var collection_bid = mongo.collection('bid');
		var json_response;

		collection_bid.find({
			username : {
				$ne : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"products" : items
			};
			console.log(json_response);
			callback(null, json_response);
		});
	});
};

exports.handle_submit_ad_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_submit_ad_queue_request:");

	var product_name 	= msg.product_name;
	var product_desc 	= msg.product_desc;
	var product_price	= msg.product_price;
	var tot_product 	= msg.tot_product;
	var username 		= msg.username;

	console.log("LISTENING TO handle_submit_ad_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_submit_ad_queue_request');
		var collection_products = mongo.collection('products');
		var collection_profile = mongo.collection('profile');

		collection_profile.findOne({
			username : username
		}, function(err, user) {
			if (user) {
				var product_owner_fname = user.fname;
				var product_owner_lname = user.lname;
				var product_owner_location = user.location;
				var product_owner_contact_info = user.contact_info;

				collection_products.insert({
					product_name : product_name,
					product_desc : product_desc,
					product_price : product_price,
					tot_product : tot_product,
					username : username,
					product_owner_fname : product_owner_fname,
					product_owner_lname : product_owner_lname,
					product_owner_location : product_owner_location,
					product_owner_contact_info : product_owner_contact_info

				}, function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
			}
		});
	});
};

exports.handle_manage_sell_items_queue_request = function (msg, callback) {

	console.log("IN handle_manage_sell_items_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_manage_sell_items_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_manage_sell_items_queue_request');

		var collection_products = mongo.collection('products');
		var json_response;

		collection_products.find({
			username : {
				$eq : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"ads" : items
			};
			console.log(json_response);
			callback(null, json_response);
		});
	});
};

exports.handle_manage_bid_items_queue_request = function (msg, callback) {

	console.log("IN handle_manage_bid_items_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_manage_bid_items_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_manage_bid_items_queue_request');

		var collection_bid = mongo.collection('bid');
		var json_response;

		collection_bid.find({
			username : {
				$eq : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"ads" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};

exports.handle_bought_history_queue_request = function (msg, callback) {

	console.log("IN handle_bought_history_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_bought_history_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_bought_history_queue_request');

		var collection_bought = mongo.collection('bought');
		var json_response;

		collection_bought.find({
			bought_product_owner : {
				$eq : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"ads" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};

exports.handle_sold_history_queue_request = function (msg, callback) {

	console.log("IN handle_sold_history_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_sold_history_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_bought_history_queue_request');

		var collection_bought = mongo.collection('bought');
		var json_response;

		collection_bought.find({
			bought_product_original_owner : {
				$eq : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"ads" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};

exports.handle_cart_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_cart_queue_request:");

	var product_id	= msg.product_id;
	var username 	= msg.username;

	console.log("LISTENING TO handle_cart_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_cart_queue_request');
		var collection_products = mongo.collection('products');
		var collection_cart 	= mongo.collection('cart');

		collection_products.findOne({
			_id : ObjectId(product_id)
		}, function(err, user) {
			if (user) {
				var product_name  = user.product_name;
				var product_price = user.product_price;
				var product_desc  = user.product_desc;
				var tot_product   = user.tot_product;
				var product_id	  = user._id;

				console.log("product_name: " + product_name);
				console.log("product_price: " + product_price);
				console.log("product_desc: " + product_desc);

				collection_cart.insert({
					username : username,
					product_name  : product_name,
					product_price : product_price,
					product_desc  : product_desc,
					tot_product	  : tot_product - 1,
					product_id 	  : product_id

				}, function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
				
				collection_products.update({
					_id : ObjectId(product_id)
				}, {
					$set : {
						tot_product : tot_product - 1
					}
				},

				function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
			}
		});

	});
};

exports.handle_bid_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_bid_queue_request:");

	var product_id	= msg.product_id;
	var username 	= msg.username;
	var product_bid	= msg.product_bid;

	console.log("LISTENING TO handle_bid_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_bid_queue_request');
		var collection_bid = mongo.collection('bid');

		collection_bid.findOne({
			_id : ObjectId(product_id)
		}, function(err, user) {
			if (user) {
				var current_highest_bid = user.current_highest_bid;

				console.log("here");
				console.log("current_highest_bid: " + current_highest_bid);
				console.log("product_bid: " + product_bid);

				if (parseInt(product_bid) > parseInt(current_highest_bid)) {
					console.log("current_highest_bid: " + current_highest_bid);
					console.log("product_bid: " + product_bid);
					collection_bid.update({
						_id : ObjectId(product_id)
					}, {
						$set : {
							current_highest_bid : product_bid,
							current_highest_bidder : username
						}
					},

					function(err, user) {
						if (user) {
							json_responses = {
								"statusCode" : 200
							};
							callback(null, json_responses);

						} else {
							console.log("returned false");
							json_responses = {
								"statusCode" : 401
							};
							callback(null, json_responses);
						}
					});
				}
			}
		});
	});
};

exports.handle_your_cart_queue_request = function (msg, callback) {

	console.log("IN handle_your_cart_queue_request:");
	var username = msg.username;
	console.log("LISTENING TO handle_your_cart_queue_request WITH msg_payload AS");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_your_cart_queue_request');

		var collection_cart = mongo.collection('cart');
		var json_response;

		collection_cart.find({
			username : {
				$eq : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"carts" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};

exports.handle_remove_cart_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_remove_cart_queue_request:");

	var product_id	= msg.product_id;
	var username 	= msg.username;

	console.log("LISTENING TO handle_remove_cart_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_remove_cart_queue_request');

		var collection_cart = mongo.collection('cart');
		var collection_products = mongo.collection('products');
		
		var json_response;
		
		
		collection_cart.findOne({
			_id : {
				$eq : ObjectId(product_id)
			}
		}, function(err, user) {
			if (user) {

				var product_idd	= user.product_id;
				var tot_product = user.tot_product;
				console.log('ghanat wajva');
				
				collection_products.update({
					_id : ObjectId(product_idd)
				}, {
					$set : {
						tot_product : tot_product + 1
					}
				},

				function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
			}
		});

		collection_cart.remove({
			_id : {
				$eq : ObjectId(product_id)
			}
		}, 
		
		function(err, items) {

			json_response = {
				"carts" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};

exports.handle_submit_bid_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_submit_ad_queue_request:");

	var product_name 	= msg.product_name;
	var product_desc 	= msg.product_desc;
	var product_price	= msg.product_price;
	var username 		= msg.username;
	var sessionStartTime= msg.sessionStartTime;
	var sessionEndTime	= msg.sessionEndTime;
	
	console.log("LISTENING TO handle_submit_ad_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {
		console.log('CONNECTED TO MONGO IN handle_submit_bid_queue_request');
		
		var collection_bid 		= mongo.collection('bid');
		var collection_profile 	= mongo.collection('profile');

		collection_profile.findOne({
			username : username
		}, function(err, user) {
			if (user) {
				var product_owner_fname = user.fname;
				var product_owner_lname = user.lname;
				var product_owner_location = user.location;
				var product_owner_contact_info = user.contact_info;

				collection_bid.insert({
					product_name : product_name,
					product_desc : product_desc,
					product_price : product_price,
					username : username,
					product_owner_fname : product_owner_fname,
					product_owner_lname : product_owner_lname,
					product_owner_location : product_owner_location,
					product_owner_contact_info : product_owner_contact_info,
					current_highest_bid : product_price,
					current_highest_bidder : username,
					session_start_time : sessionStartTime,
					session_end_time : sessionEndTime

				}, function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						callback(null, json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						callback(null, json_responses);
					}
				});
			}
		});

	});
};

exports.handle_remove_your_bid_ad_queue_request = function (msg, callback) {

	var json_responses = {};
	console.log("IN handle_remove_your_bid_ad_queue_request:");

	var product_id	= msg.product_id;
	var username 	= msg.username;

	console.log("LISTENING TO handle_remove_your_bid_ad_queue_request WITH msg_payload AS: ");
	console.log(msg);
	
	mongo.connect(mongoURL, function() {

		console.log('CONNECTED TO MONGO IN handle_remove_your_bid_ad_queue_request');

		var collection_bid = mongo.collection('bid');
		var json_response;

		collection_bid.remove({
			_id : {
				$eq : ObjectId(product_id)
			}
		}, function(err, items) {

			json_response = {
				"carts" : items
			};
			console.log(json_response);
			callback(null, json_response);

		});
	});
};