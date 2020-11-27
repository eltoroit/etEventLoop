import { LightningElement } from 'lwc';

export default class DemoBlink extends LightningElement {
    counter = 0;
    maxTimes = 10;
    isVisible = true;

    onShowImage() {
        this.updateUI(true);
    }

    onHideImage() {
        this.updateUI(false);
    }

    onFlip() {
        this.flipImage();
    }

    onVersion1() {
        this.logStart();
        while (this.counter < this.maxTimes) {
            this.increaseCounter();
            setTimeout(() => {
                this.flipImage();
            }, 500);
        }
    }

    onVersion2() {
        this.logStart();
        const loop = () => {
            this.increaseCounter();
            setTimeout(() => {
                if (this.flipImage()) {
                    loop();
                }
            }, 500);
        };
        loop();
    }

    flipImage() {
        this.updateUI(!this.isVisible);
        console.log(`${this.isVisible ? 'ON' : 'OFF'} @ ${this.getDTTM()}`);
        return this.counter < this.maxTimes;
    }

    updateUI(isVisible) {
        this.isVisible = isVisible;
        let image = this.template.querySelector('div[data-id="image"]');
        image.style.visibility = isVisible ? 'visible' : 'hidden';
    }

    increaseCounter() {
        this.counter++;
        console.log(`Counter: ${this.counter} @ ${this.getDTTM()}`);
    }

    logStart() {
        this.counter = 0;
        console.log(`Starting loop @ ${this.getDTTM()}`);
    }

    getDTTM() {
        let now = new Date();
        let dttm = now.toLocaleTimeString();
        let lastSpace = dttm.lastIndexOf(' ');
        let dttm1 = `${dttm.substring(0, lastSpace)}`;
        let dttm2 = `${dttm.substring(lastSpace, dttm.length)}`;
        return `${dttm1}.${now.getMilliseconds()}${dttm2}`;
    }
}
