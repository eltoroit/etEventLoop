import { LightningElement } from 'lwc';

export default class DemoLoops extends LightningElement {
    log = {};
    showSpinner = false;
    loopPauseSeconds = 5;

    onShowSpinner() {
        this._doSpinner(true);
    }

    onHideSpinner() {
        this._doSpinner(false);
    }

    onWhileLoop() {
        this._doSpinner(true);
        let stop = this._logStart();
        while (Date.now() < stop) {
            this._logAdd();
        }
        this._logStop('whileTrue');
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
