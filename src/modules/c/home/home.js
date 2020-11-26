import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    connectedCallback() {
        Promise.resolve().then(() => {
            let height;
            let iframes;

            this.showTab('Demos1');
            height = this.template.querySelector('c-tabset').getBoundingClientRect().height;
            height = height - 30;

            iframes = this.template.querySelectorAll('iframe');
            iframes.forEach((iframe) => {
                iframe.style.height = `${height}px`;
            });
        });
    }

    onSwitchTab(event) {
        let tabName = event.target.getAttribute('data-tab');
        this.showTab(tabName);
    }

    onBtnClick() {
        let start = new Date();
        let stop = start.setSeconds(start.getSeconds() + 5);
        while (Date.now() < stop) {
            let dttm = new Date();
            console.log(dttm.toJSON() + ' ' + dttm.getMilliseconds());
        }
    }

    showTab(tabName) {
        let tabs;

        tabs = Array.from(this.template.querySelectorAll('li[data-tab]'));
        tabs.forEach((tab) => {
            if (tab.attributes['data-tab'].value === tabName) {
                tab.classList.add('slds-is-active');
            } else {
                tab.classList.remove('slds-is-active');
            }
        });

        tabs = Array.from(this.template.querySelectorAll('div[data-tab]'));
        tabs.forEach((tab) => {
            if (tab.attributes['data-tab'].value === tabName) {
                tab.classList.remove('slds-hide');
            } else {
                tab.classList.add('slds-hide');
            }
        });
    }
}
