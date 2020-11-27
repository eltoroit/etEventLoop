import { LightningElement } from 'lwc';

export default class DemoLoops extends LightningElement {
    log = {};
    showSpinner = false;
    loopPauseSeconds = 5;

    onWhileLoop() {
        this.doSpinner(true);
        let stop = this.logStart();
        while (Date.now() < stop) {
            this.logAdd();
        }
        this.logStop('whileTrue');
        this.doSpinner(false);
    }

    onSetTimeoutLoop() {
        this.doSpinner(true);
        let stop = this.logStart();
        const loop = () => {
            if (Date.now() < stop) {
                this.logAdd();
                setTimeout(() => {
                    loop();
                }, 0);
            } else {
                this.logStop('setTimeoutLoop');
                this.doSpinner(false);
            }
        };
        loop();
    }

    onPromiseLoop() {
        this.doSpinner(true);
        let stop = this.logStart();
        const loop = () => {
            if (Date.now() < stop) {
                this.logAdd();
                Promise.resolve().then(() => {
                    loop();
                });
            } else {
                this.logStop('promiseLoop');
                this.doSpinner(false);
            }
        };
        loop();
    }

    onShowSpinner() {
        this.doSpinner(true);
    }

    onHideSpinner() {
        this.doSpinner(false);
    }

    doSpinner(showSpinner) {
        this.showSpinner = showSpinner;
    }

    logStart() {
        this.log = {};
        let start = new Date();
        console.log(`Started at ${start.toJSON()}`);
        return start.setSeconds(start.getSeconds() + this.loopPauseSeconds);
    }

    logStop(msg) {
        console.log(`Stopped at ${new Date().toJSON()}`);
        for (let [key, value] of Object.entries(this.log)) {
            this.log[key] = value.toLocaleString();
        }
        console.log(msg, this.log);
    }

    logAdd() {
        let now = new Date();
        // console.log(window.performance.now());
        if (this.log[now.getSeconds()]) {
            this.log[now.getSeconds()]++;
        } else {
            console.log(now.toLocaleTimeString());
            this.log[now.getSeconds()] = 1;
        }
    }
}
