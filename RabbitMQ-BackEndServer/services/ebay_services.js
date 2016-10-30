var ejs = require("ejs");
var mongo = require("./mongo");
var ObjectId = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/RabbitMQDB";

function handle_test_register_queue_request(msg, callback) {

	var res = {};
	console.log("In handle_test_register_queue_request:");
	console.log(msg);

	var inputPassword = msg.inputPassword;
	var inputUsername = msg.inputUsername;
	var first_name = msg.first_name;
	var last_name = msg.last_name;

	console.log("Listening to A Request with msg_payload as: ");

	res.code = "200";
	res.value = "Succes Login";
	callback(null, res);

}

exports.handle_test_register_queue_request = handle_test_register_queue_request;