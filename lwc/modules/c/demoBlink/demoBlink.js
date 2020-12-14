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
			console.log(`Counter: ${this.counter}`);
			setTimeout(
				(TCounter) => {
					console.log(`TCounter: ${TCounter}`);
					this.flipImage();
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
			console.log(`Counter: ${counter}`);
			this.flipImage();
			setTimeout(
				(TCounter) => {
					console.log(`TCounter: ${TCounter}`);
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

	flipImage() {
		this.updateUI(!this.isVisible);
	}

	updateUI(isVisible) {
		this.isVisible = isVisible;
		let image = this.template.querySelector('div[data-id="image"]');
		image.style.visibility = isVisible ? 'visible' : 'hidden';
		console.log(`${this.isVisible ? 'ON' : 'OFF'} | ${this.getDTTM()}`);
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
		return `${dttm1}.${now.getMilliseconds()}${dttm2}`;
	}
}
