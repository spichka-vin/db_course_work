const express = require("express");
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require("express-session");
const methodOverride = require('method-override');
const url = require('url');    

var registerController=require('./source/register-controller');
const initializePassport = require('./source/passport-config')
const connection = require('./source/config');
const train = require('./source/traning_lib');
const results = require('./source/results_lib');
const port = process.env.PORT || 8080;
const app = express();
initializePassport(
  passport
);

app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(flash());

app.use(session({
   secret: '343ji43ssdhsytukpoiuvcsaijvnm3jn4jk3n',
   resave: false,
   saveUninitialized: false,
   cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

function checkAuthenticated(req) {
   let flag = false;
   if (req.isAuthenticated()) {
      flag = true;
   }
      return(flag);
}

//-------------------------------------------------
app.get('/', function (req, res) {  
   let auth = checkAuthenticated(req);
   if(auth){
      res.render('index.ejs', {auth: auth, name: req.passport.nickname});
   }
   else{
      res.render('index.ejs', {auth: auth});
   }
 })
 app.get('/index', function (req, res) {  
   let auth = checkAuthenticated(req);
   if(auth){
      let name = " " + req.session.passport.user.nickname;
      
      res.render('index.ejs', {auth: auth, name: name});
   }
   else{
      res.render('index.ejs', {auth: auth});
   }
 });
 app.get('/training', function (req, res) {  
   let auth = checkAuthenticated(req);
   if(auth){
      let name = " " + req.session.passport.user.nickname;
      res.render('training.ejs', {auth: auth, name: name});
   }
   else{
      res.render('training.ejs', {auth: auth});
   } 
 });
 app.get('/results', function (req, res) {  
   let auth = checkAuthenticated(req);
   if(auth){
      let name = " " + req.session.passport.user.nickname;
      res.render('results.ejs', {auth: auth, name: name});
   }
   else{
      res.render('results.ejs', {auth: auth});
   }  
 });

 //-------------------------------------------------
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
 
//---------------------------------------------------
app.get('/res/font/agabus.ttf', function (req, res) {  
    res.sendFile( __dirname + "/" + "res/font/agabus.ttf" );  
 })
 app.get('/res/font/karet.ttf', function (req, res) {  
    res.sendFile( __dirname + "/" + "res/font/karet.ttf" );  
 })
 app.get('/res/font/vodafone.ttf', function (req, res) {  
   res.sendFile( __dirname + "/" + "res/font/vodafone.ttf" );  
})
 
//----------------------------------------------------
app.get('/js/forms.js', function (req, res) {  
    res.sendFile( __dirname + "/" + "js/forms.js" );  
 });
 app.get('/js/training.js', function (req, res) {  
   res.sendFile( __dirname + "/" + "js/training.js" );  
});
app.get('/js/results.js', function (req, res) {  
   res.sendFile( __dirname + "/" + "js/results.js" );  
});
 //---------------------------------------------------
 app.get('/res/img/show_password.png', function (req, res) {  
    res.sendFile( __dirname + "/" + "res/img/show_password.png" );  
 })
 app.get('/res/img/menu.png', function (req, res) {  
    res.sendFile( __dirname + "/" + "res/img/menu.png" );  
 })
 //----------------------------------------------------
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
//-------------------------------------------------------
app.get('*', function (req, res) { 
    res.sendFile( __dirname + "/" + "trash/error.html" );  
 })
 //------------------------------------------------------
 app.post('/signin',registerController.register, function() {
 });
app.post('/login', passport.authenticate('local'), function (req, res) {
    res.json({
      status: true,
      message: "Log in seccessfully"
    });
    //load main page
 });
 //------------------------------------------------------
app.post('/muscles', train.GetMuscles, function() {
});
app.post('/exercises', train.GetExercises, function() {
});
app.post('/exercise/muscle', train.GetMuscleByExercise, function() {
});
app.post('/training/add', train.InsertNewTraining, function() {
});
app.post('/trainings/list', train.GetTrainings, function() {
});
app.post('/training/exersise/list', train.GetTrainingExercises, function() {
});
app.delete(('/training/delete'), train.DeleteTraining, function(){
});
//-------------------------------------------------------
app.post('/results/add', results.InsertNewResults, function() {
});
app.post('/training/results/get', results.GetTrainingResults, function() {
});
app.post('/results/exercise/list', results.GetUserExercises, function() {
});
app.post('/exercise/results/get', results.GetExerciseResults, function() {
});
//-------------------------------------------------------
 app.delete('/logout', function(req, res) {
   req.logout(); 
   res.json({ 
       status: "logout"
   });
});
app.post('/controllers/register-controller', registerController.register);
//router.post('/controllers/authenticate-controller', authenticateController.authenticate);

//--------------------------------------------------------

app.listen(port, (err)=>{
    if(err) throw err;
 });
 module.exports = app;