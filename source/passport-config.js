const LocalStrategy = require('passport-local').Strategy;
var authController = require('./authenticate-controller');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey'); 

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
      //console.log("Authenticate");
        let user = {
          email: email,
          password: password
        }
        try {
          let promise = new Promise((resolve, reject) => {
              let result = authController.AuthProcess(user);
              resolve(result);
            });
          let res = await promise; 
          if(res.status) {
            return done(null, user);
          }
        }
        catch (e){
            console.log(e);
            return done (e);
        }
    }
  
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, authenticateUser));
    passport.serializeUser( async (user, done) => {
      //console.log('SERIALIZED');
      let promise = new Promise((resolve, reject) => {
        let res = authController.GetUserNickname(user.email);
        resolve(res);
      })
      let res = await promise;
      //console.log(res);
      done(null, res);
    });
  
    passport.deserializeUser(async (email, done) => {
      //console.log('DESIREALIZED');
      let promise = new Promise((resolve, reject) => {
        let res = authController.GetUserInfo(email);
        resolve(res);
      })
      let user = await promise;
      return done(null, user);
    })
  }
  
  module.exports = initialize;