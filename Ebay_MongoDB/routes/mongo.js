var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      //console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};

/*
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var numberOfConnection = 50;
var cntn;
var cntnStack = [];
var cntnQueue = [];


var createConnectionPool = function(numberOfConnection){
	var conn;
	//console.log("creating my own connection");
	
	for(var count=0; count < numberOfConnection; count++){
		//console.log("creating my own connection");
		
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      //console.log(connected +" is connected?");
      callback(db);
    });
};
		
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


exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};

exports.collection = collection;*/
