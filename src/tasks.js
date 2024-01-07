import { Task, allTasks, collectTaskData, getDatesBetween, updateTaskDone } from "./logic";
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
    console.log(e);
}
function taskInfoView (index) {
    const form = document.createElement('form');
    form.classList.add('new-task-form');
    form.setAttribute('data-num', index);
    const closeForm = document.createElement('p');
    closeForm.classList.add('close-task-view');
    closeForm.innerHTML = '&cross;';
    closeForm.setAttribute('data-num', index);
    const button = document.createElement('button');
    button.innerText = 'Done';
    button.type = 'submit';
    button.setAttribute('data-num', index);
    let item = allTasks[index];
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

    form.addEventListener('submit', updateTaskData);
    form.addEventListener('click', closeTaskView);
    return form;
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
    const index = e.target.getAttribute('data-num');
    let newSD = new Date(sD);
    let newDD = new Date(dD);
    Task.setDetails([name, desc, sD, sT, dT, dD, sev, getDatesBetween(newSD, newDD)], allTasks[index]);
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    showTaskInfo(e );
}
function closeTaskView (e) {
    if (!e.target.matches('.close-task-view')) return;
    (e.target.parentElement.parentElement.classList[1] === 'all-tasks') ?
    displayTaskElements() : '';
}
function populateTasks (arr = [], target) {
    updateTaskDone();
    if (arr.length === 0) {
        target.innerHTML =  `
            <p> There are no tasks available</p>
        `;
    } else {
        target.innerHTML = arr.map((item, i) => {
            return `
                <div data-num = ${i} ${item.status.done ? 'class="task-done"': ''}>
                    <p>${item.name}</p>
                    <p></p>
                    <input type='checkbox' id='done${i}' name='done' ${item.status.done ? 'checked' : ''}></input>
                    <button class='edit-task' data-num = ${i}>Edit Task</button>
                </div>
            `;
        }).join('');
    }
}
function showTaskInfo (e) {
    const taskListDiv = document.querySelector('.task-list-view');
    taskListDiv.innerHTML = '';
    const dataNum = e.target.getAttribute('data-num');
    taskListDiv.append(taskInfoView(dataNum));
}
function toggleDone () {
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
export function displayTaskElements () {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('task-list-view');
    div.classList.add('all-tasks');
    div.classList.remove('task-view');
    populateTasks(allTasks, div);
    content.append(newTaskForm(0), div);

    document.querySelectorAll('button.edit-task')
    .forEach(i => i.addEventListener('click', showTaskInfo));
    document.querySelectorAll(`input[type='checkbox']`)
    .forEach(i => i.addEventListener('click', toggleDone));
}