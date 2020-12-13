import '@lwc/synthetic-shadow'; // THIS MUST BE FIRST!
import Home from 'c/home';
import { createElement } from 'lwc';

const app = createElement('c-home', { is: Home });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
