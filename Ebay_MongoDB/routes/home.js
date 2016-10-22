var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt');

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

exports.profile = function(req, res) {

	var getProfileInformation = "select u.username, p.birthday, p.ebayhandle, p.contactinfo, p.location, u.logintime from users u, "
			+ "profile p where u.username ='" + req.session.username + "'";

	console.log("PROFILE QUERY IS:" + getProfileInformation);
	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {
				console.log(results);
				json_response = {
					"users" : results
				};
				res.send(json_response);
			} else {
				console.log("No such users found in database");
			}
		}
	}, getProfileInformation);
}

exports.getAllProducts = function(req, res) {

	var getAllProds = "select * from products where username <> '"
			+ req.session.username + "'";

	console.log("Query to getAllProducts is:" + getAllProds);

	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var rows = results;
				console.log(rows);
				json_response = {
					"products" : rows
				};
				res.send(json_response);

			} else {

				console.log("No items found in database");
			}
		}
	}, getAllProds);
}

function afterSignIn(req, res) {

	var dt = new Date();

	var getUser = "select password from users where username='"
			+ req.param("inputUsername") + "'";

	console.log("The Query to get password:" + getUser);

	mysql.fetchData(function(err, results) {
		console.log("fetching data from SQL");

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var hash = results[0].password;
				var myPlaintextPassword = req.param("inputPassword");

				console.log(hash);

				if (bcrypt.compareSync(myPlaintextPassword, hash)) {

					req.session.username = req.param("inputUsername");

					console.log("Valid Login--User Session initialized");

					json_responses = {
						"statusCode" : 200
					};
					res.send(json_responses);
				}
			} else {

				json_responses = {
					"statusCode" : 401
				};
				console.log("Invalid Login");
				res.send(json_responses);

			}
		}
	}, getUser);

	var updateLastLoginTime = "update test.users set logintime = currentlogintime, currentlogintime ='"
			+ dt + "' where username = '" + req.param("inputUsername") + "'";

	console.log("The Query to get updateLastLoginTime:" + updateLastLoginTime);

	mysql.fetchData(function(err, results) {
		console.log("fetching data from SQL");

		if (err) {
			console.log("fetching one");
			throw err;
		} else {
			if (results.length > 0) {
				console.log("fetching teo");
				console.log("time updated");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				json_responses = {
					"statusCode" : 401
				};
				console.log("Invalid Login");
				res.send(json_responses);

			}
		}
	}, updateLastLoginTime);
}

function registerNewUser(req, res) {

	const
	saltRounds = 10;
	const
	myPlaintextPassword = req.param("inputPassword");
	var dt = new Date();

	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(myPlaintextPassword, salt);

	var insertUser = "INSERT INTO users VALUES ('" + req.param("inputUsername")
			+ "','" + hash + "','" + req.param("first_name") + "','"
			+ req.param("last_name") + "','" + dt + "','" + dt + "')";

	console.log("QUERY to register NewUser is:" + insertUser);
	console.log(dt);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("Record NOT inserted!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("Record Inserted");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, insertUser);

}

exports.submitAd = function(req, res) {

	var insertUser = "INSERT INTO products VALUES ('"
			+ req.param("product_name") + "','" + req.param("product_id")
			+ "','" + req.param("product_price") + "','"
			+ req.param("product_desc") + "','" + req.session.username + "','"
			+ req.param("tot_product") + "')";

	console.log("QUERY to submit an AD is:" + insertUser);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("AD NOT inserted!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("AD Inserted");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, insertUser);
}

exports.updateProfile = function(req, res) {

	/*
	 * var profileQuery = "INSERT INTO profile VALUES ('" + req.session.username +
	 * "','" + req.param("bday") + "','" + req.param("euname") + "','" +
	 * req.param("cinfo") + "','" + req.param("location") + "')";
	 */

	var profileQuery = "update profile set birthday = '" + req.param("bday")
			+ "', ebayhandle= '" + req.param("euname") + "', contactinfo= '"
			+ req.param("cinfo") + "', location= '" + req.param("location")
			+ "' where username = '" + req.session.username + "'";

	var userQuery = "update users set fname = '" + req.param("first_name")
			+ "', lname= '" + req.param("last_name") + "' where username = '"
			+ req.session.username + "'";

	console.log("QUERY to modify table PROFILE is::" + profileQuery);
	console.log("QUERY to modify table USER is::" + userQuery);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("PROFILE UPDATE FAIL!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("PROFILE UPDATE SUCCESS");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, profileQuery);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("USER UPDATE FAIL!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("USER UPDATE SUCCESS");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, userQuery);
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

exports.redirectToHomepage = function(req, res) {

	console.log("ME: " + req.session.username);

	if (req.session.username) {
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

exports.cart = function(req, res) {

	var cartQuery = "INSERT INTO cart VALUES ('" + req.param("pid") + "','"
			+ req.session.username + "')";

	console.log("QUERY for inserting in CART is:" + cartQuery);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("CART FAIL!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("CART SUCCSS!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, cartQuery);
}

exports.yourCart = function(req, res) {

	var yourCartItems = "select * from products p, cart c where p.pid =  c.pid and c.username = '"
			+ req.session.username + "'";

	console.log("Query to select cart items is:" + yourCartItems);
	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var rows = results;
				console.log(rows);
				json_response = {
					"carts" : rows
				};
				res.send(json_response);

			} else {
				console.log("No item found in cart");
			}
		}
	}, yourCartItems);
}

exports.yourAd = function(req, res) {

	var getAllUsers = "select * from products where username = '"
			+ req.session.username + "'";

	console.log("Query to select your ADs is:" + getAllUsers);
	var json_response;

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				var rows = results;
				console.log(rows);
				json_response = {
					"ads" : rows
				};
				res.send(json_response);

			} else {
				console.log("No ADs under your name");
			}
		}
	}, getAllUsers);
}

exports.removeCart = function(req, res) {

	var deleteCart = "DELETE FROM test.cart WHERE pid =" + req.param("pid")
			+ " and username = '" + req.session.username + "'";

	console.log("QUERY for deleting item from cart is" + deleteCart);

	mysql.fetchData(function(err, results) {

		if (err) {
			throw err;
		} else {
			if (results.length > 0) {

				console.log("CART deletion fail!");
				json_responses = {
					"statusCode" : 200
				};
				res.send(json_responses);

			} else {

				console.log("CART deletion success!");
				json_responses = {
					"statusCode" : 401
				};
				res.send(json_responses);

			}
		}
	}, deleteCart);
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
}

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

exports.afterSignIn = afterSignIn;
exports.registerNewUser = registerNewUser;