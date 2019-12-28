function ChooseTrainingSort(){
    $('#search_type_name_type').text("Тренування");
    $('#search_type_name').text("Тренування");
    TrainingDropdownList();
    ChooseReset();  
}

function ChooseReset(){
    $('#add_res_btn').remove();
    $('#add_res_block').remove();
    $('#my_results').remove();
}

function TrainingDropdownList(){
    $.ajax(
    {
        url: "/trainings/list",
        type: "POST",
        async: true,
        success: function(msg) {
            if(msg.arr.length == 0){
                alert('У вас немає створених тренувань');
            }
            else{
                DropdownBoxRebuild();
                TrainingListCreate(msg.arr);
            }
        }
    });
}

function DropdownBoxRebuild(){
    $('#second_dropdown_box').empty();
}

function TrainingListCreate(arr){
    let el = "";
    for (let i = 0; i < arr.length; i++){
        el = arr[i];
        let str = `<a class="dropdown-item" onclick="TrainingClick(this)">${el}</a>`;
        $('#second_dropdown_box').append(str);
    }
}

function TrainingClick(el){
    let text = el.text;
    let box = el.parentNode.parentNode;
    box.childNodes[3].textContent = text;
    ChooseReset();
    let btn = `<button id="add_res_btn" class="mt-3" onclick="AddResBtnClick()">Додати результати</button>`;
    $('#settings_block').append(btn);
    ShowTrRes();
}

function ShowTrainingExercises(name){
    let ex = {
        name: name
    };
    $.ajax(
    {
        url: "/training/exersise/list",
        type: "POST",
        data: ex,
        dataType: 'json',
        async: true,
        success: function(msg) {
            CollectInputBox(msg.arr);
        }
    });  
} 

function AddResBtnClick(){
    AddResBlockCreate();
    AddBtnDelete();
    let name = $('#search_type_name').text()
    ShowTrainingExercises(name);

}

function CollectInputBox(arr){
    for(let i = 0; i < arr.length; i++){
        AddTittleBlock(arr[i]);
        AddInfoBlock();
    }
    AddBottomButton();
}

function AddResBlockCreate(){
    let block = `<div id="add_res_block" class="container offset-1 col-10 offset-sm-2 offset-lg-3 offset-xl-3 col-sm-8 col-lg-6 col-xl-6 p-0 mb-3 border-dark"></div>`
    $('#settings_block').after(block);
    let data = 
    `<div class="container pt-1 col-12 d-flex">
        <p class="m-0 p-0 col-5 d-flex justify-content-center align-items-center">Дата<span>: </span></p>
        <input type="text" class="form-control p-0 pl-1 col-7" id="data_input" name="date" placeholder="xx.xx.xxxx">
    </div>`;
    $('#add_res_block').append(data);
}

function AddTittleBlock(el){
    let block = 
    `<div class="container pt-1 col-12 d-flex">
        <p class="m-0 p-0 col-5 d-flex justify-content-center">Вправа<span>: </span></p>
        <p id="exercise_name" class="col-7 mb-1 p-0 d-flex justify-content-center">${el}</p>
    </div>`
    let main_box =  $('#add_res_block');
    main_box.append(block);
}

function AddInfoBlock(){
    block = 
    `<form id="res_input_form" class="container" onsubmit="return false">		
        <div id="input_res_box" class="container col-12 col-md-10 col-xl-8 d-flex p-0 mb-2 rounded">
            <label id="ex_try_num" for="weight_input count_input" class="col-1 d-flex justify-content-center align-items-center p-0 m-0">1</label>
            <input type="numbers" class="form-control p-0 pl-1 col-5" id="weight_input" name="weight" placeholder="Вага">
            <input type="numbers" class="form-control p-0 pl-1 col-6" id="count_input" name="count" placeholder="Кількість">
        </div>
        <div class="col-12 p-0 mb-2 d-flex justify-content-center">
            <button id="add_new_exercise" class="p-1 col-4 rounded" onclick="AddMoreInputLines(this)">Додати</button>		
        </div>
    </form>`
    let main_box =  $('#add_res_block');
    main_box.append(block);
}

function AddBottomButton(){
    block = 
    `<div class="col-12 p-0 mb-2 d-flex justify-content-center">
        <button id="confirm_training_btn" class="p-1 col-4 rounded" onclick="SendResults()">Створити</button>
    </div>`
    let main_box =  $('#add_res_block');
    main_box.append(block);
}

function AddBtnDelete(){
    $('#add_res_btn').remove();
}

function AddMoreInputLines(el){
    let num = el.parentNode.parentNode.childElementCount;
    let lines = 
    `<div id="input_res_box" class="container col-12 col-md-10 col-xl-8 d-flex p-0 mb-2 rounded">
        <label id="ex_try_num" for="weight_input count_input" class="col-1 d-flex justify-content-center align-items-center p-0 m-0">${num}</label>
        <input type="numbers" class="form-control p-0 pl-1 col-5" id="weight_input" name="weight" placeholder="Вага">
        <input type="numbers" class="form-control p-0 pl-1 col-6" id="count_input" name="count" placeholder="Кількість">
    </div>`
    el.parentNode.insertAdjacentHTML('beforebegin', lines);
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

function SendResults(){
    let msg = CollectResults();  
    let flag = AllValidation(msg);
    let name = $('#search_type_name').text();
    let letter = {
        'name': name,
        date: msg.date,
        ex: JSON.stringify(msg.ex),
        res: JSON.stringify(msg.res)
    }
    if(flag){
        $.ajax(
        {
            url: "/results/add",
            type: "POST",
            data: letter,
            dataType: 'json',
            async: true,
            success: function(ans) {
                if(ans.status){
                    window.location.reload();
                    console.log('added')
                }
                else{
                    alert(ans.msg);
                }
            }
        });
    }
}

function CollectResults(){
    let box = $('#add_res_block');
    let num = box.children().length - 2;
    let el = box.children().first().children().last();
    let date = el.val();
    el = box.children();
    let flag = true;
    let i = 0;
    let j = 1;
    let ex = [];
    let res = [];
    while(flag){
        i++;
        if(i >= num/2){
            flag = false;
        }
        let tmp = el[j];
        ex.push(tmp.children[1].textContent);
        j++;
        tmp = el[j];
        res.push(ReadInfo(tmp));
        j++
    }
    let msg = {
        date: date,
        ex: ex,
        res: res
    }
    console.log(msg);
    return msg;
}

function ReadInfo(el){
    let arr = [];
    for(let i = 0; i < el.children.length - 1; i++){
        let tmp = {
            weigth: el.children[i].children[1].value,
            repeats:  el.children[i].children[2].value
        }
        arr.push(tmp);
    }
    return arr;
}

function AllValidation(el){
    let flag = true;
    if(!DateValidation(el.date)){
        alert('Помилка з вводом дати');
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
        if(!flag){
            alert('Помилка з вводом даних');
        }
    }
    return flag;
}

//---------------------------------------------------

function ShowTrRes(){
    AddExistingTrResults();
}

function AddResBlock(){
    let block = 
    `<div id="my_results">
        <h2 id="second_title" class="d-flex justify-content-center">Результати</h2>
    </div>`
    $('#settings_block').after(block);
}

function AdMyResInfoBlock(){
    let block = `<div id="add_res_block" class="container offset-1 col-10 offset-sm-2 offset-lg-3 offset-xl-3 col-sm-8 col-lg-6 col-xl-6 p-0 mb-3 border-dark"></div>`
    $('#my_results').append(block); 
}

function AddDateLine(date){
    let box = $('#my_results').children().last();
    let line = 
    `<div class="container pt-1 col-12 d-flex">
        <p class="m-0 p-0 col-5 d-flex justify-content-center align-items-center">Дата<span>: </span></p>
        <p class="p-0 pl-1 m-0 d-flex justify-content-center align-items-center">${date}</p>
    </div>`
    box.append(line);
}
function AddExerciseLine(ex){
    let line = 
    `<div class="container pt-1 col-12 d-flex mb-1">
        <p class="m-0 p-0 col-5 d-flex justify-content-center">Вправа<span>: </span></p>
        <p id="exercise_name" class="col-7 m-0 p-0 d-flex justify-content-center">${ex}</p>
    </div>`
    let box = $('#my_results').children().last();
    box.append(line);
}

function AddBoxForResLines(){
    let line = `
    <div id="res_output_form" class="container">
        <div id="output_res_box" class="container col-12 col-md-10 col-xl-8 d-flex p-0 mb-2 rounded">
            <label id="ex_try_num" class="col-1 d-flex justify-content-center align-items-center p-0 m-0">№</label>
            <p class="p-0 m-0 col-5 d-flex justify-content-center align-items-center" id="weight_output">Вага</p>
            <p class="p-0 m-0 col-6 d-flex justify-content-center align-items-center" id="count_output">Кількість</p>
        </div>
    </div>`
    let box = $('#my_results').children().last();
    box.append(line);
}

function AddResultsLine(num, weigth, repeats){
    let line = ` 
    <div id="output_res_box" class="container col-12 col-md-10 col-xl-8 d-flex p-0 mb-2 rounded">
        <label id="ex_try_num" class="col-1 d-flex justify-content-center align-items-center p-0 m-0">${num}</label>
        <p class="p-0 m-0 col-5 d-flex justify-content-center align-items-center" id="weight_output">${weigth}</p>
        <p class="p-0 m-0 col-6 d-flex justify-content-center align-items-center" id="count_output">${repeats}</p>
    </div>`
    let box = $('#my_results').children().last().children().last();
    box.append(line);
}

function AddExistingTrResults(){
    let name = $('#search_type_name').text();
    let letter = {
        name: name
    }
    $.ajax(
    {
        url: "/training/results/get",
        type: "POST",
        data: letter,
        dataType: 'json',
        async: true,
        success: function(ans) {
            let arr = ans.arr;
            if(arr.length != 0){   
                AddResBlock();
                let date = arr[0].date;
                AdMyResInfoBlock();
                AddDateLine(date);
                for(let i = 0; i < arr.length; i++){
                    let new_date = arr[i].date;
                    if(date != new_date){
                        date = new_date;
                        AdMyResInfoBlock();
                        AddDateLine(date);
                    }        
                    AddExerciseLine(arr[i].name);   
                    AddBoxForResLines();      
                    let el = JSON.parse(arr[i].res);
                    for(let j = 0; j < el.arr.length; j++){
                        AddResultsLine(j+1,el.arr[j].weigth, el.arr[j].repeats);
                    }
                }
            }
            else{
                alert('У вас немає результатів тренувань');
            }
            
        }
    });
}



//----------------------------------------------------

function ChooseExerciseSort(){
    $('#search_type_name_type').text("Вправа");
    $('#search_type_name').text("Вправа");
    ChooseReset();
    ExerciseDropdownList();
}

function ExerciseDropdownList(){
    $.ajax(
    {
        url: "/results/exercise/list",
        type: "POST",
        async: true,
        success: function(msg) {
            if(msg.arr.length == 0){
                alert('У вас немає доданих вправ');
            }
            else{
                DropdownBoxRebuild();
                ExerciseListCreate(msg.arr);
            }
        }
    });
}

function ExerciseListCreate(arr){
    let el = "";
    for (let i = 0; i < arr.length; i++){
        el = arr[i];
        let str = `<a class="dropdown-item" onclick="ExerciseClick(this)">${el}</a>`;
        $('#second_dropdown_box').append(str);
    }
}

function ExerciseClick(el){
    let text = el.text;
    let box = el.parentNode.parentNode;
    box.childNodes[3].textContent = text;
    ChooseReset();
    ShowExRes();
}

function ShowExRes(){
    AddExistingExResults();
}

function AddExistingExResults(){
    let name = $('#search_type_name').text();
    let letter = {
        name: name
    }
    $.ajax(
    {
        url: "/exercise/results/get",
        type: "POST",
        data: letter,
        dataType: 'json',
        async: true,
        success: function(ans) {
            let arr = ans.arr;
            if(arr.length == 0){
                alert('У вас немає результатів по цій вправі');
            }
            else{
                AddResBlock();
                let date = arr[0].date;
                AdMyResInfoBlock();
                AddDateLine(date);
                    for(let i = 0; i < arr.length; i++){
                    let new_date = arr[i].date;
                    if(date != new_date){
                        date = new_date;
                        AdMyResInfoBlock();
                        AddDateLine(date);
                    
                    }         
                    AddBoxForResLines();      
                    let el = JSON.parse(arr[i].res);
                    for(let j = 0; j < el.arr.length; j++){
                        AddResultsLine(j+1,el.arr[j].weigth, el.arr[j].repeats);
                    }
                }
            }  
        }
    });
}

//---------------------------------------------------

function LoadWithTraining(el){
    if(el != null){
        let text = el;
        $('search_type_name').text(text);
        ChooseReset();
        let btn = `<button id="add_res_btn" class="mt-3" onclick="AddResBtnClick()">Додати результати</button>`;
        $('#settings_block').append(btn);
        ShowTrRes();
    }
}