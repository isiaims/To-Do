import { displayTodayTasks } from "./daily-week";
import { Task, allTasks, collectTaskData, dailyTasks, getDatesBetween, updateTaskDone } from "./logic";
import { makeFormFields, makeRadioElems } from "./projects";

function newTaskForm () {
    const form = document.createElement('form');
    form.classList.add('add-task-form');
    const button = document.createElement('button');
    button.innerText = 'Add Task';
    button.type = 'submit';
    form.append(
        makeFormFields('text', 'task-name'),
        button,
    );
    form.addEventListener('submit', addNewTask);
    return form;
}
function addNewTask (e) {
    collectTaskData();
    displayTaskElements();

    e.preventDefault();
}
function taskInfoView (index) {
    let item = allTasks[index];
    const taskListDiv = document.querySelector('.task-list-view');
    taskListDiv.innerHTML = '';

    const form = document.createElement('form');
    form.classList.add('new-task-form');
    form.setAttribute('data-num', index);
    form.setAttribute('ts', `${item.timeStamp}`);
    const closeForm = document.createElement('p');
    closeForm.classList.add('close-task-view');
    closeForm.innerHTML = '&cross;';
    closeForm.setAttribute('data-num', index);
    closeForm.addEventListener('click', closeTaskView);
    const button = document.createElement('button');
    button.innerText = 'Done';
    button.type = 'submit';
    button.setAttribute('data-num', index);
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerHTML = 'Severity Level';
    fieldset.append(
        legend,
        makeRadioElems('low', 'severity'),
        makeRadioElems('medium', 'severity'),
        makeRadioElems('high', 'severity'),
    )
    form.append(
        makeFormFields('text', 'task-name'),
        closeForm,
        makeFormFields('textarea', 'Task Description'),
        makeFormFields('date', 'task-start-date'),
        makeFormFields('time', 'task-start-time'),
        makeFormFields('time', 'task-end-time'),
        makeFormFields('date', 'task-end-date'),
        fieldset,
        button,
    );
    form.querySelector(`input[type='text']`).value = item.name;
    form.querySelector(`textarea`).value = item.desc;
    (item.startDate != "") ? 
    form.querySelector(`input[id='task-start-date']`).value = item.startDate : '';
    (item.startTime != "") ? 
    form.querySelector(`input[id='task-start-time']`).value = item.startTime : '';
    (item.dueTime != "") ? 
    form.querySelector(`input[id='task-end-time']`).value = item.dueTime : '';
    (item.dueDate != "") ? 
    form.querySelector(`input[id='task-end-date']`).value = item.dueDate : '';
    form.querySelectorAll(`input[type='radio']`).forEach(
        i => (i.value === item.severity) ? i.setAttribute('checked', '') : ''
    );

    form.addEventListener('submit', updateTaskData);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-task');
    deleteButton.innerText = 'Delete Task';
    deleteButton.setAttribute('ts', `${item.timeStamp}`);
    deleteButton.addEventListener('click', deleteTask);
    taskListDiv.append(form, deleteButton);
}
function updateTaskData (e) {
    e.preventDefault();
    const name = this.querySelector(`input[type='text']`).value;
    const desc = this.querySelector('textarea').value;
    const sD = this.querySelector(`input[id='task-start-date']`).value;
    const sT = this.querySelector(`input[id='task-start-time']`).value;
    const dT = this.querySelector(`input[id='task-end-time']`).value;
    const dD = this.querySelector(`input[id='task-end-date']`).value;
    const sev = this.querySelectorAll(`input[type='radio']`);
    let severity;
    sev.forEach(i => (i.checked) ? severity = i.value : '');
    const index = e.target.getAttribute('data-num');
    let newSD = new Date(sD);
    let newDD = new Date(dD);
    Task.setDetails([name, desc, sD, sT, dT, dD, severity, getDatesBetween(newSD, newDD)], allTasks[index]);
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    showTaskInfo(e);
}
function closeTaskView (e) {
    if (!e.target.matches('.close-task-view')) return;
    if (e.target.parentElement.parentElement.classList[1] === 'all-tasks') {
        displayTaskElements()
    } else if (e.target.parentElement.parentElement.classList[1] === 'daily-tasks') {
        let div = e.target.parentElement.parentElement;
        div.innerHTML = '';
        populateTasks(dailyTasks, div);
        document.querySelectorAll('button.edit-task')
        .forEach(i => i.addEventListener('click', showTaskInfo));
        document.querySelectorAll(`input[type='checkbox']`)
        .forEach(i => i.addEventListener('click', toggleDone));
    }
}
export function populateTasks (arr = [], target) {
    if (arr.length === 0) {
        target.innerHTML =  `
            <p> There are no tasks available</p>
        `;
    } else {
        target.innerHTML = arr.map((item, i) => {
            return `
                <div data-num = ${i} ${item.status.done ? 'class="task-done"': ''}>
                    <p>${item.name}</p>
                    <p>${item.startTime}</p>
                    <p>${item.dueTime}</p>
                    <input type='checkbox' id='done${i}' name='done' ${item.status.done ? 'checked' : ''}></input>
                    <button class='edit-task' data-num = ${i} ts=${item.timeStamp}>Edit Task</button>
                </div>
            `;
        }).join('');
    }
}
export function showTaskInfo (e) {
    const ts = e.target.getAttribute('ts');
    let dataNum = 0;
    allTasks.forEach(i => (i.timeStamp == ts) ? dataNum = allTasks.indexOf(i) : '');

    taskInfoView(dataNum);
}
export function toggleDone () {
    let index = this.parentElement.getAttribute('data-num');
    allTasks[index].status.done = !allTasks[index].status.done;
    if (allTasks[index].status.done)  {
        allTasks[index].status.time = getMidnight();
        this.parentElement.classList.add('task-done');
    } else {
        allTasks[index].status.time = 0;
        this.parentElement.classList.remove('task-done');
    }
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}
function getMidnight () {
    let r = new Date ();
    return new Date (r.getFullYear(), r.getMonth(), r.getDate() + 1).getTime();
}
function deleteTask (e) {
    const ts = e.target.getAttribute('ts');
    if (confirm('Do you want to delete this Task?\nThis cannot be undone.')) {
        let index = '';
        allTasks.forEach(i => i.timeStamp == ts ? index = allTasks.indexOf(i) : '');
        // allTasks.splice(index, 1);
        if (e.target.parentNode.classList.contains('all-tasks')) {
            displayTaskElements()   
        } else if (e.target.parentNode.classList.contains('daily-tasks')) {
            let div = e.target.parentElement;
            div.innerHTML = '';
            populateTasks(dailyTasks, div);
            document.querySelectorAll('button.edit-task')
            .forEach(i => i.addEventListener('click', showTaskInfo));
            document.querySelectorAll(`input[type='checkbox']`)
            .forEach(i => i.addEventListener('click', toggleDone));    
        }    
        localStorage.setItem('allTasks', JSON.stringify(allTasks));
    } else return;
}
export function displayTaskElements () {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('task-list-view');
    div.classList.add('all-tasks');
    div.classList.remove('task-view');
    updateTaskDone();
    populateTasks(allTasks, div);
    content.append(newTaskForm(0), div);

    document.querySelectorAll('button.edit-task')
    .forEach(i => i.addEventListener('click', showTaskInfo));
    document.querySelectorAll(`input[type='checkbox']`)
    .forEach(i => i.addEventListener('click', toggleDone));
}