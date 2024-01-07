const allProjects = JSON.parse(localStorage.getItem('allProjectItems')) || [];
const allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
const today = new Date ();
const dailyTasks = [];
let dailyProjects = getDailyProjects();
export function updateDailyProjects () {dailyProjects = getDailyProjects()};
export function getDailyProjects () {
    let project = [];
    allProjects.forEach(i =>{
      i.task.forEach(u => {
        let thisDay = (new Date(today.getFullYear(), today.getMonth(), today.getDate())).toDateString();
        if (u.runningDays.some(y => new Date (y).toDateString() == thisDay)) {
          project.push(i);
        }
      })
      
    })
    project = [...new Set(project)];
    return project;
}
export function updateTaskDone () {allTasks.forEach(i => (i.status.time < Date.now) ? i.status.done = false : '')}
export class toDo {
    static displayDate (ent, date) {
        if (ent == null || ent === "") {
            return `Task ${date}`;
        } else {
            ent = new Date (ent);
            return `${ent.toLocaleDateString()} \n ${ent.toLocaleTimeString()}`;
        }
    }
    static displaySeverity (ent) {
        if (ent === undefined) {return'Task Severity'} else return ent.toUpperCase();
    }
    constructor (name, startDate, endDate) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
class Project extends toDo {
    constructor (name, timeStamp) {
        super(name);
        this.desc = '';
        this.startDate = '';
        this.endDate = '';
        this.task = [];
        this.timeStamp = timeStamp;
    }
    setDesc (data) {
        this.desc = data;
    }
}
class ProjectTask extends toDo {
    constructor (name, startDate, endDate, severity) {
        super (name, startDate, endDate);
        this.severity = severity;
        this.completed;
        this.runningDays = [];
    }
    setSeverity (data = []) {
        this.severity = data[4].value;
    }
    setRunningDays (arr) {
        this.runningDays = arr;
    }
}
export class Task extends toDo {
    constructor (name, timeStamp) {
        super (name);
        this.timeStamp = timeStamp;
        this.status = {done: false, time: ''};
        this.desc = '';
        this.startDate = '';
        this.startTime = '';
        this.dueTime = '';
        this.dueDate = '';
        this.severity = '';
        this.runningDays = [];
    }
    static setDetails (data = [], item) {
        item.name = data[0];
        item.desc = data[1];
        item.startDate = data[2];
        item.startTime = data[3];
        item.dueTime = data[4];
        item.dueDate = data[5];
        item.severity = data[6];
        item.runningDays = [...data[7]];
    }
}

export function collectProjectsData () {
    const projectName = document.querySelector('form.new-project-form > div > input');
    const project = new Project(projectName.value, Date.now());
    allProjects.unshift(project);
    localStorage.setItem('allProjectItems', JSON.stringify(allProjects))
}
export function collectProjectTaskData() {
    const taskName = document.querySelector('input[name="task-name"]');
    const taskStartDate = document.querySelector('input[name="task-start-date"]').value;
    const taskEndDate = document.querySelector('input[name="task-end-date"]').value;
    const taskSeverity = document.querySelectorAll('input[name="severity"]');
    let severity;
    taskSeverity.forEach(i => (i.checked) ? severity = i.value : '');
    const runningDays = getDatesBetween(new Date(taskStartDate), new Date (taskEndDate));


    const projectTask = new ProjectTask(
        taskName.value,
        taskStartDate,
        taskEndDate,
        severity,
    );
    projectTask.setRunningDays(runningDays);
    return projectTask;
}

export function collectTaskData () {
    const taskName = document.querySelector('form.add-task-form > div > input');
    const project = new Task(taskName.value, Date.now(), false);
    allTasks.unshift(project);
    localStorage.setItem('allTasks', JSON.stringify(allTasks))
}

export function getDatesBetween (startDate, endDate) {
    if (startDate === "" || endDate === "") return [];
    const dates = [];

    let currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + 1
    );

    while (currentDate <= endDate) {
        dates.push(currentDate);

        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
        );
    }

    return dates;
};

export {allProjects, allTasks, dailyProjects};