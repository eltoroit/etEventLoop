import { LightningElement, api } from 'lwc';

export default class ShowCode extends LightningElement {
    _path;

    @api
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = `/resources/demos/${value}`;
    }
}
