import { LightningElement } from 'lwc';

export default class DemoLoops extends LightningElement {
	log = {};
	showSpinner = false;
	loopPauseSeconds = 5;

	get keepLooping() {
		return Date.now() < this.stopAt;
	}

	onWhileLoop() {
		this.doSpinner(true);
		this.logStart();
		while (this.keepLooping) {
			this.logAdd();
		}
		this.logStop('whileTrue');
		this.doSpinner(false);
	}

	onSetTimeoutLoop() {
		this.doSpinner(true);
		this.logStart();
		const loop = () => {
			if (this.keepLooping) {
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
		this.logStart();
		const loop = () => {
			if (this.keepLooping) {
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

	onTabSwitch() {
		this.doSpinner(false);
	}

	doSpinner(showSpinner) {
		this.showSpinner = showSpinner;
	}

	logStart() {
		this.log = {};
		let startAt = new Date();
		console.log(`Started at ${startAt.toJSON()}`);
		this.stopAt = startAt.setSeconds(startAt.getSeconds() + this.loopPauseSeconds);
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
