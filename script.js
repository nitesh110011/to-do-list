let addTask = document.getElementById('submit');

addTask.addEventListener('click', addButton)

var todolistAllData = [];

let data = localStorage.getItem('data');
if (data) {
    todolistAllData = JSON.parse(data);
}

window.onload = function () {
    showData();
}

let editing = true;

function addButton() {
    if (editing) {
        let input = document.getElementById('task-input');
        if (input.value == '') {
            alert('Add your task');
            return
        }
        let date = document.getElementById('date-input');
        let a = {
            task: input.value,
            date: date.value,
            isDone: false,
            isNotificationShown: false,
            isTenMinRemShown: false,
        }
        todolistAllData.push(a);
        saveDataInLocalStorage();
        showData();
        input.value = '';
        date.value = '';
    }
}

function returnDom(i) {
    return `<div id="list">
        <input type="checkbox" id="c-${i}"data-index="${i}" onclick="checkbutton(event)"> &nbsp;&nbsp;&nbsp;
        <span id="${i}"> ${todolistAllData[i].task}     ${todolistAllData[i].date}</span>&nbsp;&nbsp;&nbsp;
        <button id="edit-button" data-index="${i}" onclick="editbutton(event)"><i class="fa-solid fa-edit"></i></button>&nbsp;
        <button id="delete-button"data-index="${i}" onclick="deletebutton(event)"><i class="fa-solid fa-trash"></i></button>
     </div>`;
}

function showData() {
    let taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    for (let i = 0; i < todolistAllData.length; i++) {
        let task = document.createElement('div');

        task.innerHTML = returnDom(i);
        taskList.appendChild(task);
        lineThroughOnText(i);
    }
}

function lineThroughOnText(i) {
    let spanElement = document.getElementById(i);
    let checkElement = document.getElementById(`c-${i}`);
    if (todolistAllData[i].isDone) {
        spanElement.style.textDecoration = 'line-through';
        checkElement.checked = true;
    }
    else {
        spanElement.style.textDecoration = 'none';
    }
}

function checkbutton(event) {

    let index = +(event.currentTarget.dataset.index);
    todolistAllData[index].isDone = !todolistAllData[index].isDone;
    lineThroughOnText(index);
    saveDataInLocalStorage();
}

function deletebutton(event) {
    if (editing) {
        let index = +(event.currentTarget.dataset.index);
        todolistAllData.splice(index, 1);
        saveDataInLocalStorage();
        showData();
    }
}

function editbutton(event) {
    if (editing) {
        editing = false;

        let index = +(event.currentTarget.dataset.index);
        let todo = todolistAllData[index];
        let todoel = event.currentTarget.parentNode;
        todoel.innerHTML = `<div id='model'> <input type="text" id="edit-todo-name" value="${todo.task}">&nbsp;&nbsp;&nbsp;
     <input type="datetime-local" id="edit-todo-date" value="${todo.date}">&nbsp;&nbsp;&nbsp;
     <button onclick="saveChanges(${index})">Save Changes</button>&nbsp;&nbsp;&nbsp;&nbsp;
     <button onclick="goback(event,${index})" data-index="${index}">Back</button></div>`;
    }
}

function goback(event, i) {
    let gobackel = event.currentTarget.parentNode;
    gobackel.innerHTML = returnDom(i);
    lineThroughOnText(i);
    editing = true;
}

function saveChanges(index) {
    todolistAllData[index].task = document.getElementById("edit-todo-name").value,
        todolistAllData[index].date = document.getElementById("edit-todo-date").value,
        todolistAllData[index].isDone = false,
        todolistAllData[index].isNotificationShown = false,
        todolistAllData[index].isTenMinRemShown = false
    saveDataInLocalStorage();
    showData();
    editing = true;
}

function saveDataInLocalStorage() {
    localStorage.setItem('data', JSON.stringify(todolistAllData));
}

function notificationService(i) {
    let notification = document.createElement("div");
    notification.textContent = "Don't forget to " + todolistAllData[i].task;
    notification.className = "notification";
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
    saveDataInLocalStorage();
}

function setIntervalService() {
    setInterval(() => {
        for (let i = 0; i < todolistAllData.length; i++) {
            if (todolistAllData[i].date) {
                let todoDate = new Date(todolistAllData[i].date);
                let timeUntilNotification = todoDate - Date.now();
                let timeUntilTenMinRemShown = (todoDate - Date.now()) - 10 * 60 * 1000;

                if (!todolistAllData[i].isTenMinRemShown && timeUntilTenMinRemShown <= 0 && timeUntilTenMinRemShown > -1000) {
                    todolistAllData[i].isTenMinRemShown = true;
                    notificationService(i);
                }
                if (timeUntilNotification <= 0 && !todolistAllData[i].isNotificationShown && timeUntilNotification > -1000) {
                    todolistAllData[i].isNotificationShown = true;
                    notificationService(i);
                }
            }
        }
    }, 1000);
}
setIntervalService();






