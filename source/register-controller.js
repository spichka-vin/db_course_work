var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./config');
var lib = require('./library');
cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req,res){
  console.log(req.body);
  var encryptedString = cryptr.encrypt(req.body.password);
  if(Validation(req.body)){
    var users={
      "email":req.body.email,
      "nickname":req.body.nickname, 
      "password":encryptedString,
    }
    console.log(users);
     connection.query('select * from sportsmen', function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        })
      }
    });
  }
  else{
    res.json({
      status:false,
      message:'something is wrong with your data'
    })
  }
  
}

function Validation(el) {
  flag = true;

  tmp = lib.EmailCheck(el.email);
  if(!tmp || el.email.length > 100){
    flag = false;
  }
  tmp = lib.TextNumCheck(el.nickname);
  if(el.nickname.length == 0 || el.nickname.length > 50 || !tmp) {
    flag = false;
  }
  tmp = lib.TextNumCheck(el.nickname);
  if(el.password.length < 4 || tmp != null || el.password.length > 50) {
    flag = false;
  }
  if(el.password != el.passwordRepeat){
    flag = false;
  }
  return flag;
}
