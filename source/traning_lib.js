const express=require("express");
const connection = require('./config');

module.exports.GetTrainings = function(req, res){
    let atr = "";
    let select = "SELECT t.`name` from `trainings` t LEFT JOIN `sportsmen` sm ON (sm.id = t.sm_id) where (sm.`email` = ?) && (t.`deleted` = 0)"
    let mail = req.session.passport.user.email;
    connection.query(select, [mail], function (error, results, fields){
        if (error) {
            console.log('User trainings search error');
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            atr = Converter(atr);
            res.json({
                arr: atr
            });
        }
        return;
    });  
}

module.exports.GetTrainingExercises = function(req, res){
    let atr = "";
    let select = "SELECT t.`exersises` from `trainings` t LEFT JOIN `sportsmen` sm ON (sm.id = t.sm_id) where (sm.`email` = ?) && (t.`name` = ?)"
    let mail = req.session.passport.user.email;
    connection.query(select, [mail, req.body.name], function (error, results, fields){
        if (error) {
            console.log('Training`s exercises search error');
        }
        else{
            atr = JSON.parse(JSON.parse(JSON.stringify(results))[0].exersises).arr;
            res.json({
                arr: atr
            });
        }
        return;
    });  
}

module.exports.GetMuscles = function(req, res){
    let atr = "";
    connection.query("SELECT * FROM muscle_groups;", function (error, results, fields){
    if (error) {
            console.log('All muscles seqrch error');
    }
     else{
        atr = JSON.parse(JSON.stringify(results));
        atr = Converter(atr);
        res.json({
            arr: atr
        });
      }
    return;
    });  
}

module.exports.GetExercises = function(req, res){
    let atr = "";
    if(req.body.status == 'true'){
        let select = `SELECT * FROM all_exarcises;`
        connection.query(select, async function (error, results, fields){
            if (error) {
                console.log('All exercise seqrch error');
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            promise = new Promise((resolve, reject) => {
                let res = Converter(atr);
                resolve(res);
            })
            atr = Converter(atr);
            res.json({
                arr: atr
            });
        }
        return;
        });  
    }
    else{
        let select = 'SELECT e.`name` from `exercises` e LEFT JOIN `muscles` m ON (m.id = e.m_id) where (m.`name` = ?)'
        connection.query(select, [req.body.muscle], async function (error, results, fields){
            if (error) {
                console.log('Uniqueness seqrch error');
        }
        else{
            atr = JSON.parse(JSON.stringify(results));
            promise = new Promise((resolve, reject) => {
                let res = Converter(atr);
                resolve(res);
            })
            atr = Converter(atr);
            //console.log(atr);
            res.json({
                arr: atr
            });
        }
        return;
        });
    }
    
}

module.exports.GetMuscleByExercise = function(req, res){
    let atr = "";
    let select = `SELECT GET_EXERSISE_MUSCLES(?) as name;`
    connection.query(select, [req.body.ex], function (error, results, fields){
        if (error) {
            console.log('Part exercise seqrch error');
      }
      else{
        atr = JSON.parse(JSON.stringify(results));
        atr = Converter(atr);
        res.json({
            arr: atr
        });
      }
    return;
    });  
}

module.exports.InsertNewTraining = async function(req, res){
    let atr = "";
    let email = req.session.passport.user.email;
    if(TrainingNameValidation(req.body.name)){
        let var_promise = new Promise((resolve, reject) => {
            let tmp = TrainingNameUniqueness(req.body.name, email);
            resolve(tmp);
        })
        let flag = await var_promise;
        if(flag == 1) {
            res.json({
                status: false,
                msg: "У вас є тренування з такою назвою"
            });
        }
        else{
            let select = `call TRAINING_INSERT(?, ?, ?, ?);`
            let promise = new Promise((resolve, reject) => {
                let tmp = GetSportsmanId(email)
                resolve(tmp);
            });
            let id = await promise;
            console.log(id);
            let params = [id[0].id, 0, req.body.name, JSON.stringify({arr: JSON.parse(req.body.arr)})];
            connection.query(select, params, function (error, results, fields){
                if (error) {
                        console.log('Insert training error');
                }
                else{
                    res.json({
                        status: true
                    });
                }
            });
        }
    }
    else{
        res.json({
            status: false,
            msg: "У назві знаходяться некоректні символи або назва занадто довга"
        });
    }
      
}

module.exports.DeleteTraining = function (req, res) {
    let mail = req.session.passport.user.email;
    let select = "call DELETE_TRAINING(?, ?);"
    connection.query(select, [req.body.name ,mail], function (error, results, fields){
        if (error) {
            console.log('User trainings search error');
        }
        else{
            console.log("Deleted")
            res.json({
                status: true
            });
        }
        return;
    });  
}

//--------------------------------------------------------
GetSportsmanId = async function (email) {
    let atr = "";
    let select = `SELECT GET_SPORTSMAN_ID_BY_EMAIL(?) as id;`
    promise = new Promise((resolve, reject) => {
        let tmp = "";
        connection.query(select, [email], function (error, results, fields){
            if (error) {
                console.log('Id exercise search error');
            }
            else{
                tmp = JSON.parse(JSON.stringify(results));
            }
            resolve(tmp);
        });
    })
    atr = await promise;
    return atr;
}

TrainingNameUniqueness = async function (name, email) {
    let atr = "";
    promise = new Promise((resolve, reject) => {
        let tmp = "";
        connection.query(`SELECT CHECK_TRAINING_NAME_UNIQUENESS(?, ?) as res;`, [email, name], function (error, results, fields){
            if (error) {
                console.log('Training name uiqueness error');
            }
            else{
                tmp = JSON.parse(JSON.stringify(results))[0].res.data[0];
            }
            resolve(tmp);
        });
    })
    atr = await promise;
    return atr;
}

function Converter(array){
    let res = [];
    for(let i = 0; i < array.length; i++){
        res.push(array[i].name);
    }
    return res;
}

function TrainingNameValidation(el){
    let patt = /[^0-9 A-Za-zА-Яа-яіІєЄїЇґҐ]/;
    if(el.match(patt) != null || el.length == 0 || el.length > 100){
        return false;
    }
    else{
        return true;
    }
}













