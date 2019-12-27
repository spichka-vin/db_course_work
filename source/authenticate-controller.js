var Cryptr = require('cryptr');
var lib = require('./library');
var connection = require('./config');
cryptr = new Cryptr('myTotalySecretKey');
var connection = require('./config');

module.exports.AuthProcess =  async function(body){
  let ans = "null";
  promise = new Promise((resolve, reject) => {
      let res = 'nothing';
      if (Validation(body)){
        let email = body.email;
      connection.query('SELECT GET_USER_PASSWORD(?) as res;',[email], function (error, results, fields) {
        //console.log('async');
        if (error) {
          res = {
            status: false,
            message:'there are some error with query 1'
          }
        }
        else{ 
          let flag = JSON.parse(JSON.stringify(results))[0].res;
          res = Authorize(flag, body);
        }
        //console.log(ans);
        resolve(res);
      });
    }
    else{
      res = {
        status: false,
        message:"Incorrect input"
      };
      resolve(res);
    }  
  });
  ans = await promise;  
  return ans;
}


function Authorize(arg, body){
  if(arg == null){
    ans = {
      status:false,    
      message:"Email does not exits"
    };
  }
  else{
    let deArg = cryptr.decrypt(arg);
    if(body.password == deArg){
      ans = {
        status: true,
        message:'successfully authenticated'
      }   
    }
    else{
      ans = {
        status: false,    
        message:"Password does not exits"
      }
    }
  }
  return ans;
}

function Validation(el) {
  flag = true;

  tmp = lib.EmailCheck(el.email);
  if(!tmp || el.email.length > 100){
    flag = false;
  }
  tmp = lib.TextNumCheck(el.password);
  if(el.password.length < 4 || !tmp || el.password.length > 50) {
    flag = false;
  }
  return flag;
}

module.exports.GetUserInfo =  async function(email){
  let ans = "null";
  promise = new Promise((resolve, reject) => {
      let res = 'nothing';
      let select =  "SELECT GET_USER_PASSWORD(?) as res;";
      connection.query(select, [email], function (error, results, fields) {
        //console.log('async');
        if (error) {
          res = {
            status: false,
            message:'there are some error with query 2'
          }
        }
        else{
          //console.log(JSON.parse(JSON.stringify(results)));
          let password = JSON.parse(JSON.stringify(results)).password;
          let name = JSON.parse(JSON.stringify(results)).name;
          res = {
            nickname: name,
            email: email,
            password: password,
          }
        }
        resolve(res);
      });
  });
  ans = await promise;  
  return ans;
}

module.exports.GetUserNickname = async function(email){
  let ans = "null";
  promise = new Promise((resolve, reject) => {
      let res = 'nothing';
      let select =  "SELECT GET_USER_NICKNAME(?) as res;";
      connection.query(select, [email], function (error, results, fields) {
        //console.log('async');
        if (error) {
          res = {
            status: false,
            message:'there are some error with query 3'
          }
        }
        else{
          let nickname = JSON.parse(JSON.stringify(results))[0].res;
          //console.log(nickname);
          res = {
            email: email,
            nickname: nickname,
          }
        }
        resolve(res);
      });
  });
  ans = await promise;  
  return ans;
}
