var ejs = require("ejs");
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/RabbitMQDB";

function handle_request(msg, callback) {

	var res = {};
	console.log("In handle request:" + msg.username);

	var username = msg.username;
	var password = msg.password;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo in: exports.profile at' + mongoURL);
		var collection_login = mongo.collection('login');

		collection_login.findOne({
			username : username,
			password : password
		}, function(err, user) {
			if (user) {
				console.log('Hello');
				console.log(user);
				res.code = "200";
				res.value = "Succes Login";
				callback(null, res);

			} else {
				console.log('Bye');
				res.code = "401";
				res.value = "Failed Login";
				callback(null, res);
			}
		});

	});

}

function handle_register_request(msg, callback) {

	var res = {};
	console.log("In handle_register_request:");
	console.log(msg);

	var username = msg.email;
	var password = msg.password;
	var first_name = msg.first_name;
	var last_name = msg.last_name;

	mongo.connect(mongoURL, function() {
		console.log('Connected to mongo in: exports.profile at' + mongoURL);
		var collection_login = mongo.collection('login');

		collection_login.insert({
			username : username,
			password : password,
			first_name : first_name,
			last_name : last_name

		}, function(err, user) {
			if (user) {
				console.log('Hello');
				res.code = "200";
				res.value = "User Registered";
				callback(null, res);

			} else {
				console.log('Bye');
				res.code = "401";
				res.value = "User Failed To Register";
				callback(null, res);
			}
		});

	});
}

exports.handle_request = handle_request;
exports.handle_register_request = handle_register_request;