import { allProjects, dailyProjects, dailyTasks, updateDailyProjects, updateDailyTasks, updateTaskDone } from "./logic";
import { populateProjects, showProject } from "./projects";
import { populateTasks, showTaskInfo, toggleDone } from "./tasks";

function makeElem (name) {
    const elem = document.createElement('div');
    elem.classList.add(name.split(' ')
    .map(word => word.toLowerCase()).join('-'));
    elem.classList.add('project-list-div');
    elem.setAttribute('id', `${name.split(' ')
    .map((word, i) => i === 0 ? word.toLowerCase() : word).join('')}`)
    const child1 = document.createElement('h2');
    child1.innerText = name;
    const child2 = document.createElement('p');
    child2.innerText = '▼';
    elem.append(child1, child2);
    return elem;
};
export function displayTodayData () {
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = '';
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-list-view');
    projectDiv.classList.add('daily-projects');
    projectDiv.innerHTML = '';
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-list-view');
    taskDiv.classList.add('daily-tasks');
    taskDiv.innerHTML = '';
    contentDiv.append (
        makeElem('Today Tasks'),
        taskDiv,
        makeElem('Today Projects'),
        projectDiv,
    )

    document.querySelector('.today-tasks').addEventListener('click', displayTodayTasks);
    document.querySelector('.today-projects').addEventListener('click', displayTodayProjects);
}
export function displayTodayProjectData(e) {
    const div = document.querySelector('.project-list-view');
    showProject(e);
}
export function displayTodayProjects () {
    const p = this.querySelector('p');
    const div = document.querySelector('.daily-projects');
    if (this.classList.contains('projects-open')) {
        div.innerHTML = '';
        p.innerHTML = '▼';
    } else {
        updateDailyProjects();
        populateProjects(dailyProjects, div);
        p.innerHTML = '▲';

        document.querySelectorAll('div[data-list]')
        .forEach(i => i.addEventListener('click', displayTodayProjectData));
    }
    this.classList.toggle('projects-open');
}
export function displayTodayTasks () {
    const div = document.querySelector('.daily-tasks');
    const p = this.querySelector('p');
    if (this.classList.contains('tasks-open')) {
        div.innerHTML = '';
        p.innerHTML = '▼';
    } else {
        updateTaskDone();
        updateDailyTasks();
        populateTasks(dailyTasks, div);
        p.innerHTML = '▲';
    
        document.querySelectorAll('button.edit-task')
        .forEach(i => i.addEventListener('click', showTaskInfo));
        document.querySelectorAll(`input[type='checkbox']`)
        .forEach(i => i.addEventListener('click', toggleDone));
        }
    this.classList.toggle('tasks-open');
}