//super simple rpc server example
var amqp = require('amqp');
var util = require('util');

var mongo = require("./services/mongo");
var mongoSessionConnectURL = "mongodb://localhost:27017/RabbitMQDB";

var login = require('./services/login');
var ebay_services = require('./services/ebay_services');

var connection = amqp.createConnection({
	host : '127.0.0.1'
});

connection.on('ready', function() {
	console.log("listening on queues");

	connection.queue('login_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	connection.queue('register_queue', function(q) {
		q.subscribe(function(message, headers, deliveryInfo, m) {
			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			login.handle_register_request(message, function(err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});
			});
		});
	});

	connection.queue('profile_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_profile_queue_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});

	connection.queue('update_profile_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_update_profile_queue_request(message,
					function(err, res) {

						// return index sent
						connection.publish(m.replyTo, res, {
							contentType : 'application/json',
							contentEncoding : 'utf-8',
							correlationId : m.correlationId
						});

					});
		});
	});

	connection.queue('get_all_products_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_get_all_products_queue_request(message,
					function(err, res) {

						// return index sent
						connection.publish(m.replyTo, res, {
							contentType : 'application/json',
							contentEncoding : 'utf-8',
							correlationId : m.correlationId
						});

					});
		});
	});

	connection.queue('get_all_bids_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_get_all_bids_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('get_all_bids_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_get_all_bids_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('submit_ad_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_submit_ad_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('manage_sell_items_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_manage_sell_items_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('manage_bid_items_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_manage_bid_items_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('bought_history_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_bought_history_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('sold_history_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_sold_history_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('cart_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_cart_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('bid_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_bid_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('your_cart_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_your_cart_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('remove_cart_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_remove_cart_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('submit_bid_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_submit_bid_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('remove_your_bid_ad_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			ebay_services.handle_remove_your_bid_ad_queue_request(message, function(
					err, res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});

});