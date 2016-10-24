var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt');
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/EbayDatabaseMongoDB";

exports.signin = function(req, res) {

	ejs.renderFile('./views/signin.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
			console.log("successfully rendered the signin module");
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}

exports.registerNewUser = function(req, res) {

	const
	saltRounds = 10;
	const
	myPlaintextPassword = req.param("inputPassword");

	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(myPlaintextPassword, salt);

	var dt = new Date();

	console.log("Inside registerNewUser; Following are the values to insert");

	var first_name = req.param("first_name");
	var last_name = req.param("last_name");
	var inputUsername = req.param("inputUsername");
	var inputPassword = hash;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');
		var collprofile = mongo.collection('profile');

		coll.findOne({
			username : inputUsername
		}, function(err, user) {
			if (user) {
				console.log("user already exists false");
				json_responses = {
					"statusCode" : 402
				};
				res.send(json_responses);
			} else {
				coll.insert({
					username : inputUsername,
					password : hash,
					fname : first_name,
					lname : last_name,
					logintime : dt,
					currentlogintime : dt

				}, function(err, user) {
					if (user) {
						// This way subsequent requests will know the user is
						// logged in.
						req.session.username = user.username;
						console.log(req.session.username + " is the session");
						json_responses = {
							"statusCode" : 200
						};
						res.send(json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						res.send(json_responses);
					}
				});

				collprofile.insert({
					username : inputUsername,
					password : hash,
					fname : first_name,
					lname : last_name,
					logintime : dt,
					currentlogintime : dt,
					birthday : "",
					ebay_handle : "",
					contact_info : "",
					location : ""

				}, function(err, user) {
					if (user) {
						// This way subsequent requests will know the user is
						// logged in.
						req.session.username = user.username;
						console.log(req.session.username + " is the session");
						json_responses = {
							"statusCode" : 200
						};
						res.send(json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						res.send(json_responses);
					}
				});
			}

		});

	});
}

exports.afterSignIn = function(req, res) {

	var dt = new Date();
	var username = req.param("inputUsername");
	var myPlaintextPassword = req.param("inputPassword");

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');

		coll.findOne({
			username : username
		}, function(err, user) {
			if (user) {
				var password = user.password;
				console.log("The password is: " + password);
				console.log("The username is: " + username);

				if (bcrypt.compareSync(myPlaintextPassword, password)) {

					// This way subsequent requests will know the user is logged
					req.session.username = user.username;
					console.log(req.session.username + " is the session");

					json_responses = {
						"statusCode" : 200
					};
					res.send(json_responses);
				} else {
					console.log("returned false");
					json_responses = {
						"statusCode" : 401
					};
					res.send(json_responses);
				}
			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});
	});
}

exports.profile = function(req, res) {

	var username = req.session.username;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo in: exports.profile at' + mongoURL);
		var coll = mongo.collection('profile');

		coll.findOne({
			username : username
		}, function(err, user) {
			if (user) {

				json_responses = {
					"users" : JSON.parse("[" + JSON.stringify(user) + "]")
				};
				console.log(json_responses);
				res.send(json_responses);

			}
		});

	});
}

exports.updateProfile = function(req, res) {

	console.log("Inside updateProfile; Following are the values to UPDATE");

	var fname = req.param("first_name");
	var lname = req.param("last_name");
	var birthday = req.param("bday");
	var ebay_handle = req.param("ehandle");
	var contact_info = req.param("cinfo");
	var location = req.param("location");
	var username = req.session.username;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo insode updateProfile at: ' + mongoURL);
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
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
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
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);
			}
		});

	});
}

exports.getAllProducts = function(req, res) {

	console.log("inside getAllProducts");
	var username = req.session.username;

	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);

		var coll = mongo.collection('products');
		var json_response;

		coll.find({
			username : {
				$ne : username
			}
		}).toArray(function(err, items) {

			json_response = {
				"products" : items
			};
			console.log(json_response);
			res.send(json_response);

		});
	});
}

exports.submitAd = function(req, res) {

	var product_name = req.param("product_name");
	var product_desc = req.param("product_desc");
	var product_price = req.param("product_price");
	var tot_product = req.param("tot_product");
	var username = req.session.username;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo insode submitAd at: ' + mongoURL);
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
						res.send(json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						res.send(json_responses);
					}
				});
			}
		});

	});
}

exports.managesellitems = function(req, res) {

	console.log("inside managesellitems");
	var username = req.session.username;

	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);

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
			res.send(json_response);

		});
	});

}

exports.cart = function(req, res) {

	var product_id = req.param("pid");
	var username = req.session.username;

	console.log("product_id: " + product_id);
	console.log("username: " + username);

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo insode cart at: ' + mongoURL);
		var collection_products = mongo.collection('products');
		var collection_cart = mongo.collection('cart');

		collection_products.findOne({
			_id : ObjectId(product_id)
		}, function(err, user) {
			if (user) {
				var product_name = user.product_name;
				var product_price = user.product_price;
				var product_desc = user.product_desc;

				console.log("product_name: " + product_name);
				console.log("product_price: " + product_price);
				console.log("product_desc: " + product_desc);

				collection_cart.insert({
					username : username,
					product_name : product_name,
					product_price : product_price,
					product_desc : product_desc

				}, function(err, user) {
					if (user) {
						json_responses = {
							"statusCode" : 200
						};
						res.send(json_responses);

					} else {
						console.log("returned false");
						json_responses = {
							"statusCode" : 401
						};
						res.send(json_responses);
					}
				});
			}
		});

	});

}

exports.yourCart = function(req, res) {

	console.log("inside yourCart");
	var username = req.session.username;

	console.log("username: " + username);

	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);

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
			res.send(json_response);

		});
	});
}

exports.removeCart = function(req, res) {

	console.log("inside removeCart");
	var username = req.session.username;
	var product_id = req.param("pid");

	mongo.connect(mongoURL, function() {

		console.log('Connected to mongo at: ' + mongoURL);

		var collection_cart = mongo.collection('cart');
		var json_response;

		collection_cart.remove({
			_id : {
				$eq : ObjectId(product_id)
			}
		}), (function(err, items) {

			json_response = {
				"carts" : items
			};
			console.log(json_response);
			res.send(json_response);

		});
	});
}

exports.money = function(req, res) {

	var boughtItem = "insert into bought (pname, pid, pprize, pdesc, username)"
			+ " select p.pname, p.pid, p.pprize, p.pdesc, '"
			+ req.session.username + "' from products p, cart c"
			+ " where p.pid = c.pid"

	var cartQuery = "DELETE FROM test.cart WHERE username = '"
			+ req.session.username + "'";

	var productQuery = "delete from products where  totprod = 0";

	var updateTotProducts = "update products set totprod = totprod - 1 where totprod <> 0 "
			+ "and pid in ( select pid from cart where username = '"
			+ req.session.username + "')";

	console.log("QUERY for bought item is:" + boughtItem);
	console.log("QUERY for cart deletion:" + cartQuery);
	console.log("QUERY for product deletion:" + productQuery);
	console.log("Query to calculate total prize of cart:" + updateTotProducts);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("updateTotProducts fail!");
				// var hash = results[0].password;
				console.log(results);
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("updateTotProducts success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, updateTotProducts);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("boughtItem fail!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("boughtItem success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, boughtItem);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("cartQuery fail!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("cartQuery success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, cartQuery);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("productQuery fail!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("productQuery success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, productQuery);
}

exports.getAllBoughtProducts = function(req, res) {

	var getAllUsers = "select * from bought where username = '"
			+ req.session.username + "'";
	console.log("Query to bought page:" + getAllUsers);
	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var rows = results;
				console.log(rows);
				json_response = {
					"BoughtProducts" : rows
				};
				res.send(json_response);
			} else {

				console.log("No items found in database");
			}
		}
	}, getAllUsers);
}

exports.removeAd = function(req, res) {

	var insertUser = "DELETE FROM products WHERE username='"
			+ req.session.username + "' and pid =" + req.param("pid");

	console.log("QUERY to delete your AD" + insertUser);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("AD deletion fail!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("AD deletion success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, insertUser);
};

exports.calculate = function(req, res) {

	var getAllUsers = "select sum(pprize) tot from products p, cart c where p.pid = c.pid and c.username = '"
			+ req.session.username + "'";

	console.log("Query to calculate total prize of cart:" + getAllUsers);
	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var rows = results;
				console.log("hii:::@" + results[0].pid);
				json_response = {
					"total" : rows
				};
				res.send(json_response);

			} else {

				console.log("No item found in cart");
			}
		}
	}, getAllUsers);
}

// Redirects to the homepage
exports.redirectToHomepage = function(req, res) {
	// Checks before redirecting whether the session is valid
	if (req.session.username) {
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
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
	req.session.destroy();
	res.redirect('/');
};