var ejs = require('ejs');
var mysql = require('mysql');
var numberOfConnection = 50;
var cntn;
var cntnStack = [];
var cntnQueue = [];


var createConnectionPool = function(numberOfConnection){
	var conn;
	//console.log("creating my own connection");
	
	for(var count=0; count < numberOfConnection; count++){
		//console.log("creating my own connection");
		
		conn = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : '1234',
			database : 'test',
			port : 3306
		});
		
		cntnStack.push(conn);
		
	}
}

var getConnection = function(callback){
	console.log("inside getConnection logic!");
	
	if(cntnStack.length > 0){
		console.log("Length of cntnStack in getConnection before pop: "+ cntnStack.length)
		connection = cntnStack.pop();

		console.log("Length of cntnStack in getConnection after pop: "+ cntnStack.length)
		callback(null, connection);
	}
	else{
		console.log("Length of queue in getConnection method before push queue: "+ cntnQueue.length)
		cntnQueue.push(callback);
		console.log("Length of queue in getConnection method after push queue: "+ cntnQueue.length)
	}
	
}

setInterval(function(){
	//console.log('inside setInterval')
	if(cntnStack.length > 0){
		if(cntnQueue.length > 0){
			console.log('removing the connection from the queue');
			callback = cntnQueue.shift();
			connection = cntnStack.pop();
			callback(null, connection);
		}
	}
}, 100000)


createConnectionPool(numberOfConnection);


exports.fetchData = function(callback, sqlQuery ) {

	//console.log("SQL Query inside fetchData:" + sqlQuery);
	
	getConnection(function(err, connection) {
		
		connection.query(sqlQuery, function(err, result) {
			//console.log("Executing the Query");
			if (err) {
				throw (err);
			}
			if (result) {
				console.log("Length of stack in code : "+ cntnStack.length)

				console.log("DB Results:" + result);
				
				connection.releaseConnection;
				cntnStack.push(connection);
				console.log("Length of stack in fetchData : "+ cntnStack.length)

				callback(err, result);
			}
		});
	});
}

/*var ejs = require('ejs');
var mysql = require('mysql');

// Put your mysql configuration settings - user, password, database and port
function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '1234',
		database : 'test',
		port : 3306
	});
	return connection;
}

function fetchData(callback, sqlQuery) {

	console.log("\nSQL Query:" + sqlQuery);

	var connection = getConnection();

	connection.query(sqlQuery, function(err, rows, fields) {
		if (err) {
			console.log("ERROR: " + err.message);
		} else { // return err or result
			console.log("DB Results:" + rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}

exports.fetchData = fetchData;*/