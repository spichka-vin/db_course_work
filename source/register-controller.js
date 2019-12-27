var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./config');
var lib = require('./library');
cryptr = new Cryptr('myTotalySecretKey');
 
module.exports.register=function(req, res){

  if(Validation(req.body)){
    Uniqueness(req.body, res);
  }
  else{
    res.json({
      status: false,
      message:'Incorrect data input'
    })
  }
}

function Uniqueness(body, res) {
  let arg = [body.email];

  connection.query("Select FIND_SPORTSMAN_BY_EMAIL(?) as res;", arg, function (error, results, fields){
      if (error) {
            console.log('Uniqueness seqrch error');
      }
      else{
        let checker = JSON.parse(JSON.stringify(results))[0].res.data[0];
        if(checker == 1){
          res.json({
            status: false,
            message:'ERROR!!! Sportsman with this email already exist'
          })
        }
        else{
          AddSportsmen(body, res);
        }  
      }
      return;
    });
}

function AddSportsmen(body, res) {
  let encryptedString = cryptr.encrypt(body.password);
  let users = [body.email, body.nickname, encryptedString];

     connection.query('call SPORTSMAN_INSERT(?, ?, ?)', users, function (error, results, fields) {
      if (error) {
        console.log(error);
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
      return;
    });
}

function Validation(el) {
  let flag = true;

  tmp = lib.EmailCheck(el.email);
  if(!tmp || el.email.length > 100){
    flag = false;
  }
  tmp = lib.TextNumCheck(el.nickname);
  if(el.nickname.length == 0 || el.nickname.length > 50 || !tmp) {
    flag = false;
  }
  tmp = lib.TextNumCheck(el.password);
  if(el.password.length < 4 || !tmp || el.password.length > 50) {
    flag = false;
  }
  if(el.password != el.passwordRepeat){
    flag = false;
  }
  return flag;
}

