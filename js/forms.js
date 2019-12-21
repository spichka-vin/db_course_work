function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
function httpPostAsync(theUrl,data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.send(data);
}



function GetValues(el){
	let values = el.serializeArray();
	return values;
}
function PasswordCheck(val){
	let patt = /[^0-9A-Za-z]/;
	return val.match(patt);
}
function EmailCheck(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function InputBorderChange(border){
	border.css(
		{
			"border-style": "solid",
			"border-width": "bold",
			"border-color": "#E00000"
	});
}
function InputBorderChangesReset(border){
		border.css(
		{
			"border-width": "thin",
			"border-color": "#696969"
	});
}
function ShowPasswordButtonCahnge(el){
	el.css({
		"border-width": "bold",
		"border-color": "#E00000"
	})
	console.log(el);
}
function ShowPasswordButtonCahngesReset(el){
	el.css({
		"border-width": "thin",
		"border-color": "#696969"
	})
}
function ShowPassword(el) {
	let pass = document.getElementById(el);
	if (pass.type === "password") {
	    pass.type = "text";
	  } 
	  else {
	    pass.type = "password";
	  }
}



function LoginErrorsMatching(arr){
	let flag = true;
	let tmp;

	tmp = EmailCheck(arr[0].value);
	if(!tmp || arr[0].value.length > 100){
		flag = false;
		InputBorderChange($("#log_in_inputEmail"));
	}
	else{
		InputBorderChangesReset($("#log_in_inputEmail"));
	}

	tmp = PasswordCheck(arr[1].value);
	if(arr[1].value.length < 4 || tmp != null || arr[1].value.length > 50){
		flag = false;
		InputBorderChange($("#log_in_inputPassword"));
		ShowPasswordButtonCahnge($("#log_in_show_password_btn"));
	}
	else{
		InputBorderChangesReset($("#log_in_inputPassword"));
		ShowPasswordButtonCahngesReset($("#log_in_show_password_btn"));
	}
	return flag;
}
function ResetLogin(){
	InputBorderChangesReset($("#log_in_inputEmail"));
	InputBorderChangesReset($("#log_in_inputPassword"));
	ShowPasswordButtonCahngesReset($("#log_in_show_password_btn"));
	document.getElementById("log_in_inputEmail").value = "";
	document.getElementById("log_in_inputPassword").value = "";
}
function LoginFormResult(){
	let form_array = GetValues($("#log_in_form"));
	let tmp = LoginCompression(form_array);
	console.log(tmp);
	let flag = LoginErrorsMatching(form_array);
	if(flag){
		httpGetAsync('/login', (res)=>LoginCorrect(res));
	}		
}
function LoginCorrect(arg){
	console.log(arg);
}








function SigninErrorsMatching(arr){
	let flag = true;
	let tmp;

	tmp = PasswordCheck(arr[0].value);
	if(arr[0].value.length == 0 || tmp != null || arr[0].value.length > 50){
		flag = false;
		InputBorderChange($("#sign_in_inputNickname"));
	}
	else{
		InputBorderChangesReset($("#sign_in_inputNickname"));
	}

	tmp = EmailCheck(arr[1].value);
	if(!tmp || arr[1].value.length > 100){
		flag = false;
		InputBorderChange($("#sign_in_inputEmail"));
	}
	else{
		InputBorderChangesReset($("#sign_in_inputEmail"));
	}

	tmp = PasswordCheck(arr[2].value);
	if(arr[2].value.length < 4 || tmp != null || arr[2].value.length > 50){
		flag = false;
		InputBorderChange($("#sign_in_inputPassword"));
		ShowPasswordButtonCahnge($("#sign_in_show_password_btn"));
	}
	else{
		InputBorderChangesReset($("#sign_in_inputPassword"));
		ShowPasswordButtonCahngesReset($("#sign_in_show_password_btn"));
	}

	if(arr[3].value != arr[2].value || arr[2].value.length < 4 || tmp != null || arr[2].value.length > 50){
		flag = false;
		InputBorderChange($("#sign_in_inputPasswordRepeat"));
		ShowPasswordButtonCahnge($("#sign_in_show_password_repeat_btn"));
	}
	else{
		InputBorderChangesReset($("#sign_in_inputPasswordRepeat"));
		ShowPasswordButtonCahngesReset($("#sign_in_show_password_repeat_btn"));
	}
	return flag;
}
function ResetSignin(){
	InputBorderChangesReset($("#sign_in_inputNickname"));
	InputBorderChangesReset($("#sign_in_inputPassword"));
	ShowPasswordButtonCahngesReset($("#sign_in_show_password_btn"));
	ShowPasswordButtonCahngesReset($("#sign_in_show_password_repeat_btn"));
	document.getElementById("sign_in_inputPassword").value = "";
	document.getElementById("sign_in_inputPasswordRepeat").value = "";
}
function SigninDataConverter(arg){
	let res = {
		'email': arg[1].value,
		'nickname': arg[0].value,
		'password': arg[2].value,
		'passwordRepeat':arg[3].value
	}
	return res;
}
function SigninFormResult(){
	let form_array = GetValues($("#sign_in_form"));
	let flag = SigninErrorsMatching(form_array);
	let form = SigninDataConverter(form_array);
	console.log(form);
	if(flag){
		//httpPostAsync("/signin",form ,(res) => SigninAcception(res));
		$.ajax(
	   {
	        url: "/signin",
	        type: "POST",
	        data: form,
	        dataType: 'json',
	        async: true,
	        success: function(msg) {
	            alert(msg);
	        }
	    });
	}		
}
function SigninAcception(arg){
	console.log(arg);
}