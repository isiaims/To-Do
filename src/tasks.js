import { allTasks, collectTaskData } from "./logic";
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
    const closeForm = document.createElement('p');
    closeForm.classList.add('close-task-view');
    closeForm.innerHTML = '&cross;';
    closeForm.setAttribute('data-num', index);
    const button = document.createElement('button');
    button.innerText = 'Add Task';
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
        makeFormFields('datetime-local', 'task-start-date'),
        makeFormFields('datetime-local', 'task-end-date'),
        fieldset,
        button,
    );
    form.querySelector(`input[type='text']`).value = item.name;
    return form;
}
function updateTaskData () {
    
}
function populateTasks (arr = [], target) {
    if (arr.length === 0) {
        target.innerHTML =  `
            <p> There are no tasks available</p>
        `;
    } else {
        target.innerHTML = arr.map((item, i) => {
            return `
                <div data-num = ${i}>
                    <p>${item.name}</p>
                    <p></p>
                    <input type='checkbox' id='done${i}' name='done'></input>
                    <button data-num = ${i}>Edit Task</button>
                </div>
            `;
        }).join('');
    }
}
function showTaskInfo () {
    const taskListDiv = document.querySelector('.task-list-view');
    taskListDiv.innerHTML = '';
    const dataNum = this.getAttribute('data-num');
    taskListDiv.append(taskInfoView(dataNum));
}

export function displayTaskElements () {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('task-list-view');
    // div.classList.add('all-tasks');
    div.classList.remove('task-view');
    populateTasks(allTasks, div);
    content.append(newTaskForm(0), div);

    document.querySelectorAll('button[data-num]')
    .forEach(i => i.addEventListener('click', showTaskInfo));

}