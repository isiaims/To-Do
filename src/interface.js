import { displayProjectElems } from "./projects";

const bodyElements = (() => {
    const header = document.createElement('header');
    const main = document.createElement('main');
    const footer = document.createElement('footer');
    return {header, main, footer,};
});
function headerElements () {
    const appName = document.createElement('h1');
    appName.innerText = 'To-Do';
    document.querySelector('header').appendChild(appName);
}
function mainElements () {
    const sideBar = document.createElement('div');
    sideBar.classList.add('sidebar');
    const content = document.createElement('div');
    content.classList.add('content');
    document.querySelector('main').append(sideBar, content);
};
function sideBarElements () {
    function makeElem (name) {
        const elem = document.createElement('h3');
        elem.innerText = name;
        elem.classList.add(name.split(' ')
        .map(word => word.toLowerCase()).join('-'));
        return elem;
    };
    document.querySelector('.sidebar').append(
        makeElem('All Projects'),
        makeElem('All Tasks'),
        makeElem('Today'),
        makeElem('This Week'),
    )
};
function footerElements () {
    const h3 = document.createElement('h3');
    h3.innerHTML = `&copy;AimsDev2023`;
    document.querySelector('footer').appendChild(h3);
}
export function makeBodyElements () {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('.content-div');
    contentDiv.append(
        bodyElements().header, bodyElements().main,bodyElements().footer
    );
    document.body.append(contentDiv);
    headerElements();
    mainElements();
    sideBarElements();
    displayProjectElems();
    footerElements();
}