var express = require("express");
var bodyParser = require('body-parser');
var connection = require('./source/config');
var app = express();
const port = process.env.PORT || 8080;

var authenticateController=require('./source/authenticate-controller');
var registerController=require('./source/register-controller');
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})
app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );  
})
app.get('/training.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "training.html" );  
})
app.get('/results.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "results.html" );  
})

app.get('/css/style.css', function (req, res) {  
   res.sendFile( __dirname + "/" + "css/style.css" );  
})
app.get('/css/forms.css', function (req, res) {  
   res.sendFile( __dirname + "/" + "css/forms.css" );  
})
app.get('/css/normalize.css', function (req, res) {  
   res.sendFile( __dirname + "/" + "css/normalize.css" );  
})
app.get('/css/results.css', function (req, res) {  
   res.sendFile( __dirname + "/" + "css/results.css" );  
})
app.get('/css/training.css', function (req, res) {  
   res.sendFile( __dirname + "/" + "css/training.css");  
})


app.get('/res/font/agabus.ttf', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/font/agabus.ttf" );  
})
app.get('/res/font/karet.ttf', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/font/karet.ttf" );  
})


app.get('/js/forms.js', function (req, res) {  
   res.sendFile( __dirname + "/" + "js/forms.js" );  
})

app.get('/res/img/show_password.png', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/img/show_password.png" );  
})
app.get('/res/img/menu.png', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/img/menu.png" );  
})

app.get('/res/photo/slider_photo1.jpg', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/photo/slider_photo1.jpg" );  
}) 
app.get('/res/photo/slider_photo2.jpg', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/photo/slider_photo2.jpg" );  
}) 
app.get('/res/photo/slider_photo3.jpg', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/photo/slider_photo3.jpg" );  
}) 
app.get('/res/photo/slider_photo4.jpg', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/photo/slider_photo4.jpg" );  
})  
 


// app.get('*', function (req, res) {  
//    res.sendFile( __dirname + "/" + "trash/error.html" );  
// })

/* route to handle login and registration */
app.post('/signin',registerController.register);
app.post('/login',authenticateController.authenticate);
 
console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.listen(port);


















// http.createServer(function (req, res){

// 	try{
// 		let reqUrl = req.url.replace('/', '');

// 		if(StrInclude(reqUrl,'LogIn')){
// 			console.log("1111111111111111111111");
//       		mysqlOpt.query('select * from sportsmen;', function(err, rows, fields){
//         		if (err) throw err;
//         		res.writeHead(200,{'Content-type':'text/plain'});
//         	res.end(JSON.stringify(rows));
//         	console.log(res);
//      	 	})
//      	 	return 0;
//     	}

//     	if(StrInclude(reqUrl, 'SignIn')){
//     		SignIn(req, res);
//     		return 0;
//     	}

		

// 	// addUser();
// }).listen(port)

// //-----------------------------------------------

// function SignIn(req, res){
// 	processPost(req, res, function(){
//     	var array = req.post;
//     	console.log(req.post);
// 		console.log(array[0]);
//     	res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
//         res.end();
// 	});
// }



// // ----------------------------------------------

// function ContentTypeOfUrl(url){
// 	if (url.indexOf('.css') >= 0){
// 		return 'text/css';
// 	}
// 	if (url.indexOf('.js') >= 0){
// 		return 'text/script';
// 	}
// 	return 'text/html';
// }
// function FileExists(pathFile){
// 	if (fs.existsSync(pathFile)) {
//     	return 1;
// 	}
// 	return 0;
// }
// function StrInclude(url, part) {
// 	if(url.indexOf(part) >= 0){
// 		return true;
// 	}
// 	return false;
// }
// function processPost(request, response, callback) {
//     var queryData = "";
//     if(typeof callback !== 'function') return null;

//     if(request.method == 'POST') {
//         request.on('data', function(data) {
//             queryData += data;
//             if(queryData.length > 1e6) {
//                 queryData = "";
//                 response.writeHead(413, {'Content-Type': 'text/plain'}).end();
//                 request.connection.destroy();
//             }
//         });

//         request.on('end', function() {
//             request.post = JSON.parse(queryData);
//             callback();
//         });

//     } else {
//         response.writeHead(405, {'Content-Type': 'text/plain'});
//         response.end();
//     }
// }











// var loginUserSQL = `loginUser("${userEmail}", "${userPassword}")`;
// var queryLoginUser = `select * from actor;` ;

// var userEmail = "spichka.vin@gmail.com"
// var userPassword = "0000"

// function loginUser(){
// mysqlOpt.query(queryLoginUser, function(err,rows,fields){
// if(err) throw err;
// console.log(rows);
// for (var i in rows) {
// console.log("Post titles: ", rows[i]);
// }
// Object.keys(rows).forEach(function(key){
// console.log(rows[key].first_name);
// 	});
// });
// }

// var insertUserSQL = `call APP_USERS_BASE_INSERT("${userEmail}", "${userPassword}")`;

// function addUser(){
// 	mysqlOpt.query(insertUserSQL, function(err,rows,fields){
// 		if(err) throw err;
// 		console.log(err);
// 	});
// }


