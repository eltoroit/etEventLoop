import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    connectedCallback() {
        Promise.resolve().then(() => {
            let tabs = this.template.querySelectorAll('li[data-tab]');
            tabs = Array.from(tabs);
            let tab = tabs[0];
            tab.classList.add('slds-is-active');
        });
    }

    switchTab(event) {
        let tabs;
        let clickedId = event.target.getAttribute('data-tab');

        tabs = Array.from(this.template.querySelectorAll('li[data-tab]'));
        tabs.forEach((tab) => {
            if (tab.attributes['data-tab'].value === clickedId) {
                tab.classList.add('slds-is-active');
            } else {
                tab.classList.remove('slds-is-active');
            }
        });

        tabs = Array.from(this.template.querySelectorAll('div[data-tab]'));
        tabs.forEach((tab) => {
            if (tab.attributes['data-tab'].value === clickedId) {
                tab.classList.remove('slds-hide');
            } else {
                tab.classList.add('slds-hide');
            }
        });
    }
}
