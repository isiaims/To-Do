import './styles.css';
import { 
    makeBodyElements, 
} from './interface';
import { displayProjectElems } from './projects';
import { displayTodayData } from './daily-week';
import { displayTaskElements } from './tasks';


makeBodyElements();
const content = document.querySelector('.content');
const newProjectForm = content.querySelector('form');
const allProjectDivs = content.querySelectorAll('.content > div');
const projectCategories = [...document.querySelectorAll('.sidebar > h3')];

makeActive(projectCategories[0]);
function makeActive (elem) {
    let elemClass = elem.classList;
    projectCategories
    .map(i => (i !== elem) ? i.classList.remove('active') :
    elemClass.add('active'));
}
projectCategories.forEach(i => i.addEventListener('click', (e) => {
    const target = e.target;
    if (target === projectCategories[0]) {
        makeActive(target);
        displayProjectElems();
    } else if (target === projectCategories[1]) {
        makeActive(target);
        displayTaskElements();
    } else if (target === projectCategories[2]) {
        makeActive(target);
        displayTodayData();
    } else if (target === projectCategories[3]) {
        makeActive(target);
    }
}));
