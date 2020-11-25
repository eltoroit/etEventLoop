import Home from 'c/home';
import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';

const app = createElement('c-home', { is: Home });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
