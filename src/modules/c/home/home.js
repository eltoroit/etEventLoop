import { LightningElement } from 'lwc';

export default class Home extends LightningElement {
    connectedCallback() {
        Promise.resolve().then(() => {
            let height;
            let iframes;

            this.showTab('Simulator');
            height = this.template.querySelector('div[data-id="tabContent"]').getBoundingClientRect().height;
            height = height - 30;

            iframes = this.template.querySelectorAll('iframe');
            iframes.forEach((iframe) => {
                iframe.style.height = `${height}px`;
            });
        });
    }

    switchTab(event) {
        let tabName = event.target.getAttribute('data-tab');
        this.showTab(tabName);
    }

    showTab(tabName) {
        let tabs;

        let iframe = this.template.querySelectorAll('iframe')[0];
        console.log(iframe);

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
