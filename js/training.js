function ShowSportsmanTrainings(){
    $.ajax(
    {
        url: "/trainings/list",
        type: "POST",
        async: true,
        success: function(msg) {
            if(msg.arr.length > 0){
                AddTrainingBox();
                ShowTrainingRows(msg.arr);
            }
        }
    });
}

function AddTrainingBox(){
    let box = 
    `<div id="trainings_block" class="border-dark rounded col-12 p-0 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
    </div>`
    $('#exist_training_box').append(box);
}

function ShowTrainingRows(list){
    let el;
    let parent = $('#trainings_block');
    for (let i = 0; i< list.length; i++){
        el = list[i];
        var training_raw = `
        <div id="training_block_element" class="m-1" data-loaded="false" data-showed="false">
            <div id="element_top" class="d-flex col-12 align-items-center p-0">
                <button class="dropdown-toggle col-1 pl-1 pr-1" id="training_dropdownMenuButton" onclick="ShowTrainingExercises(this)"></button>
                <p id="tr_name" class="m-0 col-6 d-flex justify-content-center p-0">${el}</p>
                <button class="col-4 p-0 h-100" id="go_to_res_btn" onclick="GoToRes(this)">Результ.</button>
                <button class="col-1 p-0 h-100" id="delete_training_btn" onclick="DeleteExercise(this)">&times;</button>
            </div>
            <div id="element_body" class="row ml-0 d-flex col-12 align-items-center p-0">
            </div>
        </div>`
        parent.append(training_raw);
    }
}

function ShowTrainingExercises(el){
    let box = el.parentNode.parentNode;
    if(box.dataset.loaded == 'false'){
        let ex = {
            name: el.parentNode.childNodes[3].textContent
        };
        $.ajax(
        {
            url: "/training/exersise/list",
            type: "POST",
            data: ex,
            dataType: 'json',
            async: true,
            success: function(msg) {
                ShowExersiseRow(msg.arr, box);
            }
        });
    }
    else{
        ShowHideExersises(box);
    }  
}

function ShowExersiseRow(list, box){
    box = box.childNodes[3];
    el = "";
    for(let i = 0; i < list.length; i++){
        el = list[i];
        let row = `
        <div class="d-flex col-12 p-0 mt-1 mb-1">
            <p id="ex_num" class="m-0  p-0 col-1 d-flex justify-content-center align-items-center">${i+1}</p>
            <p id="ex_name" class="m-0 p-0 pl-1 col-11 d-flex justify-content-center align-items-center">${el}</p>
        </div>`
        box.innerHTML += row;
    }
    box.parentNode.dataset.loaded = true;
    box.parentNode.dataset.showed = true;
}

function ShowHideExersises(box){
    if(box.dataset.showed == 'true'){
        box.childNodes[3].className = "d-none";
        box.dataset.showed = false;
    }
    else{
        box.childNodes[3].className = "row ml-0 d-flex col-12 align-items-center p-0";
        box.dataset.showed = true;
    }
    return 0;  
}

function DeleteExercise(el){
    let box = el.parentNode;
    let name = {
        name: el.parentNode.childNodes[3].textContent
    }
    console.log(name);
    let tmp = confirm("Ви дійсно хочете видалити тренування???");
    if(tmp){
        $.ajax({
            url: "/training/delete",
            type: "DELETE",
            data: name,
            dataType: 'json',
            async: true,
            success: function(msg){
                if(msg.status){
                    box.remove();
                }
            }
        });
    }   
}





//-----------------------------

function StartCreating() {
    let num = 1;

    let cr_tr_lock = `
    <div id="new_training_adding_block" class="container p-0 m-0 col-12">
        <div id="exercise_table" class="col-12 row mt-2 ml-0 p-1 border-dark rounded">
            <div id="exercise_table_el_block" class="col-12 p-0 mt-1 mb-1">

            </div>
            <div id="add_ex_footer" class="col-12 p-0">
                <button id="add_new_exercise" class="p-1 col-5 offset-1" onclick="AddEx()">Додати</button>
                <button id="confirm_training_btn" class="p-1 col-5" onclick="AddTraining()">Створити</button>
            </div>
        </div>
    </div>
    `
    let header = `
        <div id="table_header_block" class="d-flex col-12 p-0 ">
            <p id="new_training_name_label" class="col-5 col-md-4 col-lg-3 p-0 m-0">Назва тренування:</p>
            <p id="new_training_name" contenteditable="true" class="col-7 col-md-8 col-lg-9 p-0 m-0"></p>
        </div>
    `
    let new_ex_raw = `
    <div id="new_input" class="d-flex col-12 p-0 mb-1">
        <p id="new_numer" class="col-1 p-0 m-0 d-flex justify-content-center align-items-center">${num}</p>
        <div  class="col-11 p-0">
            <div id="new_muscle_input_box" class="dropleft d-flex col-12 p-0	"> 	
                <p id="new_muscle" class=" col-11 p-0 m-0 d-flex justify-content-center">Група м'язів</p>
                <button id="new_dropdown_muscle" class="dropdown-toggle col-1  p-0" data-toggle="dropdown"></button>
                <div id="menu_list_box" class="dropdown-menu border-dark" aria-labelledby="dropdownMenuButton">

                </div>
            </div>
            <div id="new_exercise_input_box" class="dropleft d-flex col-12 p-0">
                <p id="new_exercise" class=" col-11 p-0 m-0 d-flex justify-content-center">Вправа</p>
                <button id="new_drobdown_exercise" class="dropdown-toggle col-1  p-0" data-toggle="dropdown"></button>
                <div id="menu_list_box" class="dropdown-menu border-dark" aria-labelledby="dropdownMenuButton">

                </div>
            </div>
        </div>
    </div>
    `

    $('#add_trainings_block').append(cr_tr_lock);
    $('#exercise_table').prepend(header);
    $('#exercise_table_el_block').append(new_ex_raw);
    $('#create_traning_button').css({
        "display": "none"
    });
    MuscleList();
    ExercisesList(true, null, null);
}

function AddEx(){
    let num =  parseInt(GetLustNum()) + 1;

    let new_ex_raw = `
    <div id="new_input" class="d-flex col-12 p-0 mb-1">
        <p id="new_numer" class="col-1 p-0 m-0 d-flex justify-content-center align-items-center">${num}</p>
        <div  class="col-11 p-0">
            <div id="new_muscle_input_box" class="dropleft d-flex col-12 p-0"> 	
                <p id="new_muscle" class=" col-11 p-0 m-0 d-flex justify-content-center">Група м'язів</p>
                <button id="new_dropdown_muscle" class="dropdown-toggle col-1  p-0" data-toggle="dropdown"></button>
                <div id="menu_list_box" class="dropdown-menu border-dark" aria-labelledby="dropdownMenuButton">

                </div>
            </div>
            <div id="new_exercise_input_box" class="dropleft d-flex col-12 p-0">
                <p id="new_exercise" class=" col-11 p-0 m-0 d-flex justify-content-center">Вправа</p>
                <button id="new_drobdown_exercise" class="dropdown-toggle col-1  p-0" data-toggle="dropdown"></button>
                <div id="menu_list_box" class="dropdown-menu border-dark" aria-labelledby="dropdownMenuButton">

                </div>
            </div>
        </div>
    </div>
    `
    $('#exercise_table_el_block').append(new_ex_raw);
    MuscleList();
    ExercisesList(true, null, null);
}

function GetLustNum(){
    let el = $('#exercise_table_el_block').children().last().children().first();
    return el.text();
}

function MuscleList() {
    let array;
    $.ajax(
    {
        url: "/muscles",
        type: "POST",
        async: true,
        success: function(msg) {
            array = msg.arr;
            text =  CreateMuscleList(array);
            let box = $('#exercise_table_el_block').children().last().children().last().children().first().children().last();
            box.append(text);
        }
    });  
}

function CreateMuscleList(array){
    let res = "";
    let el;
    for (let i = 0; i < array.length; i++){
        el = array[i];
        let layout = `<a id="dropdown_item" class="dropdown-item border-bottom border-top" onclick="MuscleSelected(this)">${el}</a>`
        res +=  layout;
    }
    return res;
}

function CreateExerciseList(array){
    let res = "";
    let el;
    for (let i = 0; i < array.length; i++){
        el = array[i];
        let layout = `<a id="dropdown_item" class="dropdown-item border-bottom border-top" onclick="ExerciseSelected(this)">${el}</a>`
        res +=  layout;
    }
    return res;
}

function MuscleSelected(start_el){
    let el = start_el.parentNode.parentNode.childNodes[1];
    let text = start_el.text
    el.innerHTML = text;
    el = start_el.parentNode.parentNode.parentNode.childNodes[3].childNodes[1];
    el.innerHTML = "Вправа";
    el = start_el.parentNode.parentNode.parentNode.childNodes[3].childNodes[5];
    ExercisesList(false, el, text);
}

function ExerciseSelected(start_el){
    let form = {
        ex: start_el.text
    }
    let el = start_el.parentNode.parentNode.parentNode.childNodes[1].childNodes[1];
    $.ajax(
        {
            url: "/exercise/muscle",
            type: "POST",
            data: form,
	        dataType: 'json',
            async: true,
            success: function(msg) {
                el = start_el.parentNode.parentNode.parentNode.childNodes[1].childNodes[1];
                el.innerHTML = msg.arr[0];
            }
        });
    el = start_el.parentNode.parentNode.childNodes[1];
    el.innerHTML = start_el.text;
}

function ExercisesList(flag, elem, muscle){
    let array;
    if(flag){
        let form = {
            status: flag
        }
        $.ajax(
        {
            url: "/exercises",
            type: "POST",
            data: form,
	        dataType: 'json',
            async: true,
            success: function(msg) {
                array = msg.arr;
                text =  CreateExerciseList(array);
                let box = $('#exercise_table_el_block').children().last().children().last().children().last().children().last();
                box.append(text);
            }
        });
    }
    else{
        let form = {
            status: false,
            muscle: muscle 
        }
        console.log(form);
        $.ajax(
        {
            url: "/exercises",
            type: "POST",
            data: form,
            dataType: 'json',
            async: true,
            success: function(msg) {
                array = msg.arr;
                //console.log(array);
                text =  CreateExerciseList(array);
                //let box = $('#exercise_table_el_block').children().last().children().last().children().last().children().last();
                elem.innerHTML = text;
            }
        });
    }  
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

function AddTraining(){
    let name = $('#new_training_name').text();
    let n = GetLustNum();
    let flag = true;
    flag = TrainingNameValidation(name);

    if(!flag){
        alert('Проблеми з назвою тренування');
    }else{
        let arr = CollectAllExercises(n);
        flag = ValidArray(arr);
        if(!flag){
            alert('Проблеми у виборі вправ');
        }
        else{
            let msg = {
                arr: JSON.stringify(arr),
                name: name
            }
            console.log(msg);
            $.ajax(
                {
                    url: "/training/add",
                    type: "POST",
                    data: msg,
                    dataType: 'json',
                    async: true,
                    success: function(ans) {
                        if(ans.status){
                            window.location.reload();
                        }
                        else{
                            alert(ans.msg);
                        }
                    }
                });
        }
    }     
}

function CollectAllExercises(n){
    let el = $('#exercise_table_el_block').children().first();
    let arr = [];
    
    for(let i = 0; i < n; i++){
        let tmp = el.children().last().children().last().children().first();
        arr.push(tmp.text());
        el = el.next();
    }
    return arr;
}

function ValidArray(arr) {
    let flag = true;
    for(let i = 0; i < arr.length; i++){
        if(arr[i] == 'Вправа'){
            flag = false;
        }
    }
    return flag;
}


function GoToRes(el){
    let text = el.parentNode.childNodes[3].textContent;
    let my_url = "/results?name=" + text;
    window.open(my_url,"_self");
}
