import { LightningElement } from 'lwc';

export default class DemoLoops extends LightningElement {
    log = {};
    showSpinner = false;
    loopPauseSeconds = 5;

    onWhileLoop() {
        this._doSpinner(true);
        let stop = this._logStart();
        while (Date.now() < stop) {
            this._logAdd();
        }
        this._logStop('whileTrue');
        this._doSpinner(false);
    }

    onSetTimeoutLoop() {
        this._doSpinner(true);
        let stop = this._logStart();
        const loop = () => {
            if (Date.now() < stop) {
                this._logAdd();
                setTimeout(() => {
                    loop();
                }, 0);
            } else {
                this._logStop('setTimeoutLoop');
                this._doSpinner(false);
            }
        };
        loop();
    }

    onPromiseLoop() {
        this._doSpinner(true);
        let stop = this._logStart();
        const loop = () => {
            if (Date.now() < stop) {
                this._logAdd();
                Promise.resolve().then(() => {
                    loop();
                });
            } else {
                this._logStop('promiseLoop');
                this._doSpinner(false);
            }
        };
        loop();
    }

    onShowSpinner() {
        this._doSpinner(true);
    }

    onHideSpinner() {
        this._doSpinner(false);
    }

    _doSpinner(showSpinner) {
        this.showSpinner = showSpinner;
    }

    _logStart() {
        this.log = {};
        let start = new Date();
        console.log(`Started at ${start.toJSON()}`);
        return start.setSeconds(start.getSeconds() + this.loopPauseSeconds);
    }

    _logStop(msg) {
        console.log(`Stopped at ${new Date().toJSON()}`);
        for (let [key, value] of Object.entries(this.log)) {
            this.log[key] = value.toLocaleString();
        }
        console.log(msg, this.log);
    }

    _logAdd() {
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
