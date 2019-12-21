var mysql = require('mysql');
var connection = mysql.createConnection({
 	host : "zanner.org.ua",
 	port : 33321,
 	user : "ka7519",
 	password : "sergo71alex99alya73-3",
 	database : "ka7519"
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection;