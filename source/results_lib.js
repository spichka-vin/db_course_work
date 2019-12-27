const express=require("express");
const connection = require('./config');

module.exports.InsertNewResults = async function(req, res){
    
    let atr = "";
    let msg = {
        name: req.body.name,
        date: req.body.date,
        ex: JSON.parse(req.body.ex),
        'res': (JSON.parse(req.body.res))
    }
    console.log(msg);
    let email = req.session.passport.user.email;
    if(AllValidation(msg)){
        let tr_id_promise = new Promise((resolve, reject) => {
            let tmp = GetTrainingId(email, req.body.name);
            resolve(tmp);
        })
        let tr_id = await tr_id_promise;
        let select = `call ADD_RESULTS(?, ?, ?, ?);`;
        let date = DateConverter(msg.date);
        let flag = true;
        for(let i = 0; i < msg.res.length; i++){
            let ex_id_promise = new Promise((resolve, reject) => {
                let tmp = GetExerciseId(msg.ex[i]);
                resolve(tmp);
            })
            let ex_id = await ex_id_promise;
            let results = {
                arr: msg.res[i]
            }
            connection.query(select, [tr_id, ex_id, date, JSON.stringify(results)], function (error, results, fields){
                if (error) {
                    console.log(error);
                    console.log('Insert results error');
                    flag = false
                    
                }
            });
        }
        if(flag){
            res.json({
                status: true
            });
        }
        else{
            res.json({
                status: false,
                msg: "Помилка у даті"
            });
        }
    }
}

GetTrainingId = async function (email, name) {
    let atr = "";
    let select = `select GET_TRAINING_ID_BY_NAME_EMAIL(?, ?) as id;`
    promise = new Promise((resolve, reject) => {
        let tmp = "";
        connection.query(select, [email, name], function (error, results, fields){
            if (error) {
                console.log('Id training id search error');
            }
            else{
                tmp = JSON.parse(JSON.stringify(results));
            }
            resolve(tmp);
        });
    })
    atr = await promise;
    return atr[0].id;
}

function DateConverter(date){
    let tmp = JSON.stringify(date);
    console.log(tmp);
    let res = ""
    res += tmp[7] + tmp[8] + tmp[9] + tmp[10] + tmp[6];
    res += tmp[4] + tmp[5] + tmp[3];
    res += tmp[1] + tmp[2]; 
    console.log(res);
    return res;
}


GetExerciseId = async function (name) {
    let atr = "";
    let select = `select GET_EXERCISES_ID(?) as id;`
    promise = new Promise((resolve, reject) => {
        let tmp = "";
        connection.query(select, [name], function (error, results, fields){
            if (error) {
                console.log('Id training id search error');
            }
            else{
                tmp = JSON.parse(JSON.stringify(results));
            }
            resolve(tmp);
        });
    })
    atr = await promise;
    return atr[0].id;
}



function AllValidation(el, res){
    let flag = true;
    if(!DateValidation(el.date)){
        flag = false;
    }
    if(flag){
        for(let i = 0; i < el.res.length; i++){
            for(let j = 0; j < el.res[i].length; j++){
                if(!NumValidation(el.res[i][j].weigth) || !NumValidation(el.res[i][j].repeats)){
                    flag = false;
                }
            }  
        }
    }
    if(!flag){
        res.json({
            res: status = false,
            msg: 'Некорктні дані'
        })
    }
    return flag;
}

function DateValidation(date){
    let flag = true;
    if(date[2] != '.' || date[5] != '.' || date.length != 10){
        flag = false;
    }
    let patt = /[^0-9.]/
    if(date.match(patt) != null){
        flag = false;
    }
    return flag;
}
function NumValidation(el){
    let flag = true;
    let patt = /[^0-9.]/;
    if(el.match(patt) != null || el.length > 100){
        flag = false;
    }
    return flag;
}

module.exports.GetTrainingResults = function(req, res){
    let atr = "";
    let select = "SELECT DATE_FORMAT(r.date, '%d.%m.%Y') as date, r.res, e.name from `results` r LEFT JOIN `exercises` e ON (e.id = r.ex_id) LEFT JOIN `trainings` t ON (r.tr_id = t.id) LEFT JOIN `sportsmen` sm ON (sm.id = t.sm_id) where (t.`name` = ? && sm.`email` = ?) ORDER BY r.date desc"
    let mail = req.session.passport.user.email;
    connection.query(select, [req.body.name, mail], function (error, results, fields){
        if (error) {
            console.log('User trainings search error');
            console.log(error);
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            res.json({
                arr: atr
            });
        }
        return;
    });  
}

module.exports.GetUserExercises = function(req, res){
    let atr = "";
    let select = "SELECT t.`exersises` from `trainings` t LEFT JOIN `sportsmen` sm ON (sm.id = t.sm_id) where (sm.`email` = ?)"
    let mail = req.session.passport.user.email;
    connection.query(select, [mail, req.body.name], function (error, results, fields){
        if (error) {
            console.log('Training`s exercises search error');
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            atr = ExerciseConverter(atr);
            res.json({
                arr: atr
            });
        }
        return;
    });  
}

function ExerciseConverter(arr){
    let res = [];
    for(let i = 0; i < arr.length; i++){
        let el = JSON.parse(arr[i].exersises).arr;
        for(let j = 0; j < el.length; j++){
            if(!res.includes(el[j])){
                res.push(el[j])
            }
        }
    }

    return res;
}

module.exports.GetExerciseResults = function(req, res){
    let atr = "";
    let select = "SELECT DATE_FORMAT(r.date, '%d.%m.%Y') as date, r.res from `results` r LEFT JOIN `exercises` e ON (e.id = r.ex_id) LEFT JOIN `trainings` t ON (r.tr_id = t.id) LEFT JOIN `sportsmen` sm ON (sm.id = t.sm_id) where (e.`name` = ? && sm.`email` = ?) ORDER BY date desc"
    let mail = req.session.passport.user.email;
    connection.query(select, [req.body.name, mail], function (error, results, fields){
        if (error) {
            console.log('User trainings search error');
            console.log(error);
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            res.json({
                arr: atr
            });
        }
        return;
    });  
}