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

	onVersion1() {
		this.counter = 0;
		this.logStart();
		while (this.counter < this.maxTimes) {
			this.counter++;
			console.log(`Loop | ${this.getDTTM()} | Counter: ${this.counter < 10 ? '0' : ''}${this.counter}`);
			setTimeout(
				(TCounter) => {
					this.flipImage(TCounter);
				},
				500,
				this.counter
			);
		}
	}

	onVersion2() {
		this.counter = 0;
		this.logStart();
		const loop = (counter) => {
			this.counter = counter;
			this.flipImage(counter);
			setTimeout(
				(TCounter) => {
					// console.log(`TCounter: ${TCounter} | ${this.getDTTM()}`);
					if (this.counter < this.maxTimes) {
						loop(TCounter);
					} else {
						this.updateUI(true);
					}
				},
				500,
				counter + 1
			);
		};
		loop(1);
	}

	onTabSwitch() {
		this.counter = 0;
		this.updateUI(true);
	}

	onFlip() {
		this.flipImage();
	}

	flipImage(TCounter) {
		this.updateUI(!this.isVisible, TCounter);
	}

	updateUI(isVisible, TCounter) {
		let msgTCounter = '';
		this.isVisible = isVisible;
		let image = this.template.querySelector('div[data-id="image"]');
		image.style.visibility = isVisible ? 'visible' : 'hidden';
		if (TCounter !== undefined) {
			msgTCounter = ` | Counter: ${TCounter < 10 ? '0' : ''}${TCounter}`;
			console.log(`${this.isVisible ? ' ON' : 'OFF'} | ${this.getDTTM()}${msgTCounter}`);
		}
	}

	logStart() {
		console.log(`Starting loop @ ${this.getDTTM()}`);
	}

	getDTTM() {
		let now = new Date();
		let dttm = now.toLocaleTimeString();
		let lastSpace = dttm.lastIndexOf(' ');
		let dttm1 = `${dttm.substring(0, lastSpace)}`;
		let dttm2 = `${dttm.substring(lastSpace, dttm.length)}`;
		let ms = now.getMilliseconds();
		return `${dttm1}.${ms < 100 ? '0' : ''}${ms < 10 ? '0' : ''}${ms}${dttm2}`;
	}
}
