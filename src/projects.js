import { displayTodayProjectData } from "./daily-week";
import { allProjects, collectProjectsData, dailyProjects, getDailyProjects, toDo, updateRecentProjects } from "./logic";

function makeFormFields (type, id) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.setAttribute('for', `${id}`);
    label.innerText = id.split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
    div.append(label);
    if (type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.name = id;
        div.append(textarea);
    } else {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        (type === 'text') ? input.required = true : input.required = false;
        div.append(input);
    }
    return div;
}
function makeRadioElems (id, name) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.setAttribute('for', `${id}`);
    label.innerText = id[0].toUpperCase() + id.slice(1);
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = id;
    input.name = name;
    input.value = id;
    div.append(input, label);
    return div;
}
function newProjectForm () {
    const form = document.createElement('form');
    form.classList.add('new-project-form');
    const button = document.createElement('button');
    button.innerText = 'Add Project';
    button.type = 'submit';
    form.append(
        makeFormFields('text', 'project-name'),
        button,
    );
    form.addEventListener('submit', addNewProjects);
    return form;
}
export function populateProjects (arr = [], target) {
    if (arr.length === 0) {
        target.innerHTML =  `
            <p> There are no projects available</p>
        `;
    } else {
        target.innerHTML = arr.map((item, i) => {
            return `
                <div data-list = ${i}>
                    <p>${item.name}</p>
                    <p></p>
                    <p></p>
                </div>
            `;
        }).join('');
    }
}
function projectView (targetDiv, proj, target) {
    targetDiv.innerHTML = '';
    targetDiv.classList.add('project-view');
    const header = document.createElement('header');
    const h2 = document.createElement('h2');
    h2.innerHTML = (proj.name).toUpperCase();
    const closeButton = document.createElement('h3');
    closeButton.classList.add('close-project-view');
    closeButton.innerHTML = '&cross;';
    header.append(h2, closeButton);
    const div = document.createElement('div');
    div.classList.add('info');
    const start = document.createElement('p');
    const due = document.createElement('p');
    const desc = document.createElement('p');
    desc.classList.add('project-description' );
    if (proj.desc === '') {
        desc.innerHTML = `
            <form data-list=${target}>
                <div>
                    <label for='desc'>Add Project Description:</label>
                    <textarea name="desc" id="desc" cols="30" rows="3"></textarea>
                </div>
                <div>
                    <p class='close-desc-form' data-list=${target}>&cross;</p>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        `
    } else {desc.innerHTML = proj.desc};
    div.append(start, due, desc);
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    populateTaskDiv(proj.task, taskDiv, target);
    const deleteProjectButton = document.createElement('button');
    deleteProjectButton.innerHTML = 'Delete Project';
    deleteProjectButton.classList.add(`delete-project`);
    deleteProjectButton.setAttribute('data-list', `${target}`);
    targetDiv.append(header, div, taskDiv, deleteProjectButton);

}
export function showProject (e, elem, arr = []) {
    if ((e.target.matches('div[data-list]')) || (e.target.matches('.close-desc-form'))) {
        const target = e.target;
        const index = target.getAttribute('data-list');
        let item = arr[index];
        projectView(elem, item, index);

        // Event Listener for setting project description
        document.querySelector('.project-description')
        .addEventListener('submit', setProjectDescription);
        document.querySelector('.project-description')
        .addEventListener('click', closeDescForm);
        // Event Listener for adding project tasks
        document.querySelector('.new-task-form')
        .addEventListener('submit', displayProjectTask);
        // Event Listener for closing project view
        document.querySelector('.close-project-view')
        .addEventListener('click', () => closeProjectView(arr));
        // Event Listener for deleting project
        document.querySelector('.delete-project')
        .addEventListener('click', deleteProject);
    }
}
export function displayProjectTask (e) {
    e.preventDefault();
    collectProjectsData();
    let index = e.target.getAttribute('data-list');
    populateTaskDiv(allProjects[index].task, e.target.parentNode, index);
}

export function displayProjectElems () {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('project-list-view');
    div.classList.add('recent-projects');
    div.classList.remove('project-view');
    const h3 = document.createElement('h3');
    h3. innerText = 'Recently Added Projects';
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-list');
    div.append(h3, projectDiv);
    populateProjects(allProjects, div);
    content.append(newProjectForm(), div);

    // Event Listener for displaying recently added project info
    document.querySelectorAll('div[data-list]')
    .forEach(i => i.addEventListener('click', displayProjectData));
    
}
function addNewProjects (e) {
    collectProjectsData();
    displayProjectElems();

    document.querySelectorAll('div[data-list]')
    .forEach(i => i.addEventListener('click', displayProjectData));

    e.preventDefault();
    e.target.reset();
}
export function displayProjectData(e) {
    const div = document.querySelector('.project-list-view');
    showProject(e, div, allProjects);
}
function newTaskForm (index) {
    const form = document.createElement('form');
    form.classList.add('new-task-form');
    form.setAttribute('data-list', `${index}`);
    const button = document.createElement('button');
    button.innerText = 'Add Task';
    button.type = 'submit';
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
        makeFormFields('datetime-local', 'task-start-date'),
        makeFormFields('datetime-local', 'task-end-date'),
        fieldset,
        button,
    );
    form.addEventListener('submit', displayProjectTask);
    return form;
}
export function populateTaskDiv (arr = [], target, data) {
    if (arr.length === 0) {
        target.append(newTaskForm(data));
    } else {
        target.classList.add('has-task');
        target.innerHTML = arr.map((item, i) => {
            return `
                <div data-num = ${i}>
                    <p>${item.name}</p>
                    <p>${toDo.displayDate(item.startDate, 'Start Date')}</p>
                    <p>${toDo.displayDate(item.endDate, 'End Date')}</p>
                    <p>${toDo.displaySeverity(item.severity)}</p>
                    <input data-num=${i} type='checkbox' name='completed' id='completed${i}'>
                    <button class='edit-task' data-num = ${i}>Edit Task</button>
                    <button class='remove-task' data-num = ${i}>Remove Task</button>
                </div>
            `;
        }).join('');
        target.append(newTaskForm(data));
    }
}
function closeDescForm (e) {
    if (!e.target.matches('.close-desc-form')) return;
    if (confirm('Your project has no description?')) {
        const index = e.target.getAttribute('data-list');
        const project = allProjects[index];
        project.desc = 'No description required';
        localStorage.setItem('allProjectItems', JSON.stringify(allProjects));
        updateRecentProjects()
        displayProjectData(e);
    } else return;
}
function closeProjectView (arr = []) {
    const div = document.querySelector('.project-list-view');
    div.classList.remove('project-view');
    div.innerHTML = '';
    if (arr === allProjects) {
        const projectDiv = document.createElement('div');
        populateProjects(arr, projectDiv);
        div.append(projectDiv);
        document.querySelectorAll('div[data-list]')
        .forEach(i => i.addEventListener('click', displayProjectData));
    } else if (arr === dailyProjects) {
        populateProjects(arr, div);
        const divs = document.querySelectorAll('div[data-list]');
        divs.forEach(i => i.addEventListener('click', displayTodayProjectData));

    }    
}
function deleteProject (e) {
    const index = e.target.dataset.list;
    if (confirm('Do you want to delete this project?\nThis cannot be undone.')) {
            allProjects.splice(index, 1);
            updateRecentProjects();
            getDailyProjects();
            if (e.target.parentNode.classList.contains('recent-projects')) {
                closeProjectView(allProjects);   
            } else if (e.target.parentNode.classList.contains('daily-projects')) {
                closeProjectView(dailyProjects);
            }    
            localStorage.setItem('allProjectItems', JSON.stringify(allProjects)); 
    } else return;
}
function setProjectDescription (e) {
    e.preventDefault();
    const index = e.target.getAttribute('data-list');
    const text = this.querySelector('textarea').value;
    allProjects[index].desc = text;
    updateRecentProjects();
    localStorage.setItem('allProjectItems', JSON.stringify(allProjects)); 
    displayProjectData(e);
}
