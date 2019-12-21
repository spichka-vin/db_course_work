var express=require("express");

module.exports.TextNumCheck = function(val){
  let patt = /[^0-9A-Za-z]/;
  if(val.match(patt) != null){
    return false;
  }
  return true;
}

module.exports.EmailCheck = function(email){
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports.SigninErrorsMatching = function(arr){
  let flag = true;
  let tmp;

  tmp = PasswordCheck(arr[0].value);
  if(arr[0].value.length == 0 || tmp != null || arr[0].value.length > 100){
    flag = false;
  }

  tmp = EmailCheck(arr[1].value);
  if(!tmp || arr[1].value.length > 100){
    flag = false;
  }

  tmp = PasswordCheck(arr[2].value);
  if(arr[2].value.length < 4 || tmp != null || arr[2].value.length > 50){
    flag = false;
  }
  if(arr[3].value != arr[2].value || arr[2].value.length < 4 || tmp != null || arr[2].value.length > 50){
    flag = false;
  }
  return flag;
}


