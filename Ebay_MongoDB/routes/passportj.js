/**
 * 
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var loginDatabase = "mongodb://localhost:27017/EbayDatabaseMongoDB";
var mongo = require('./mongo');
var bcrypt = require('bcrypt');

module.exports = function(passport) {
	console.log("here");
	passport.use('signin', new LocalStrategy(
			function(username, password, done) {

				var dt = new Date();
				var myPlaintextPassword = password;

				mongo.connect(loginDatabase, function() {

					console.log('CONNECTED TO MONGO in passportJS');
					var collection_login = mongo.collection('login');
					var collection_profile = mongo.collection('profile');
					var json_responses;

					collection_login.findOne({
						username : username
					}, function(err, user) {
						if (user) {
							var password = user.password;

							console.log("The password is: " + password);
							console.log("The username is: " + username);
							console.log(user);

							if (bcrypt.compareSync(myPlaintextPassword,
									password)) {

								done(null, user);
							} else {
								done(null, false);
							}

						} else {
							done(null, false);
						}
					});

					collection_profile.findOne({
						username : username
					}, function(err, user) {
						if (user) {
							var currentlogintime = user.currentlogintime;

							collection_profile.update({
								username : username
							}, {
								$set : {
									logintime : currentlogintime,
									currentlogintime : dt
								}
							},

							function(err, user) {
								if (user) {
									json_responses = {
										"statusCode" : 200
									};
									console.log(json_responses);

								} else {
									console.log("returned false");

									json_responses = {
										"statusCode" : 401
									};
									console.log(json_responses);
								}
							});

							json_responses = {
								"statusCode" : 200
							};
							console.log(json_responses);

						} else {
							console.log("returned false");
							json_responses = {
								"statusCode" : 401
							};
							console.log(json_responses);
						}
					});

				});

			}));
};