import * as UI from "./UI.js";
import { etEvents } from "./ET_Events.js";

export class Data {
	demo = {};
	step = {};
	demos = [];
	steps = [];
	slide = null;
	demoNumber = undefined;
	stepNumber = null;
	oldStepNumber = null;

	async read() {
		let url = "./samples/_samples.json";
		let response = await fetch(url);
		let data = await response.json();
		this.slide = data.slide;
		this.demos = data.demos;
		this.stepNumber = null;
		this.oldStepNumber = null;
		return this.demos;
	}

	async selectDemo(demoNumber) {
		let lines = "";
		this.demoNumber = demoNumber;
		this.demo = this.demos[this.demoNumber];
		let url = `./samples/${this.demo.code}.json`;
		let response = await fetch(url);
		this.demo.steps = await response.json();
		this.steps = this.demo.steps;
		this.steps.forEach((step, idx) => {
			step.index = idx;
			lines += "|" + step.lineNumber;
		});
		this.demo.lines = lines;
		return this.demo;
	}

	selectStep(stepNumber) {
		this.oldStepNumber = this.stepNumber;
		this.stepNumber = stepNumber;
		if (stepNumber === null) {
			this.step = null;
		} else {
			this.step = this.steps[stepNumber];
		}
	}

	getStep(stepNumber) {
		return this.steps[stepNumber];
	}

	reset() {
		this.step = {};
		this.demo = {};
		this.steps = [];
		this.stepNumber = null;
		this.oldStepNumber = undefined;
	}
}

const STATES = { BEFORE: "BEFORE", NAVIGATING: "NAVIGATING", AFTER: "AFTER" };
export class Navigator {
	_steps = null;
	timer = null;
	state = null;
	stepNumber = null;

	// Buttons
	btnReset;
	btnPrevArrow;
	btnNextArrow;
	btnTimerStop;
	btnTimerStart;
	sampleSelector;

	constructor() {
		this.btnReset = new UI.Reset();
		this.btnPrevArrow = new UI.PrevArrow();
		this.btnNextArrow = new UI.NextArrow();
		this.btnTimerStop = new UI.TimerStop();
		this.btnTimerStart = new UI.TimerStart();
		this.sampleSelector = new UI.SampleSelector();
		this.onReset();
	}

	reset() {
		this.onStopTimer();
		this._steps = null;
		this.stepNumber = null;
		this.state = STATES.BEFORE;
		this.render();
	}

	set steps(value) {
		this._steps = value;
	}

	onStartTimer() {
		let delay = null;

		// Find delay
		const urlParams = new URLSearchParams(window.location.search);
		let urlTimer = urlParams.get("timer");
		if (urlTimer) {
			urlTimer = Number(urlTimer);
			if (urlTimer > 0) {
				delay = urlTimer;
			}
		} else {
			delay = 1000;
			// delay = 500;
			let newUrl = `${window.location.pathname}?timer=${delay}`;
			window.history.pushState(null, document.title, newUrl);
		}

		// Start timer
		this.onNext();
		this.timer = setInterval(() => {
			this.onNext();
		}, delay);
		this.render();
	}

	onStopTimer() {
		if (this.timer) {
			this.btnTimerStart.show();
			this.btnTimerStart.hide();
			clearInterval(this.timer);
			this.timer = null;
			this.render();
		}
	}

	onReset() {
		this._log("RESET:START");
		this.stepNumber = null;
		this.state = STATES.BEFORE;
		try {
			etEvents.fire("prevStep", this.stepNumber);
			this.render();
		} catch (ex) {
			// Nothing
		}
		this._log("RESET:END");
	}

	onPrev() {
		this._log("PREV:START");
		switch (this.state) {
			case STATES.BEFORE: {
				throw new Error("Back button should not be visible");
				break;
			}
			case STATES.NAVIGATING: {
				if (this.stepNumber > 0) {
					this.stepNumber--;
					etEvents.fire("prevStep", this.stepNumber);
				} else if (this.stepNumber == 0) {
					this.stepNumber = null;
					this.state = STATES.BEFORE;
					etEvents.fire("prevStep", this.stepNumber);
				} else {
					throw new Error("Can't move next");
				}
				break;
			}
			case STATES.AFTER: {
				this.stepNumber = this._steps.length - 1;
				this.state = STATES.NAVIGATING;
				etEvents.fire("prevStep", this.stepNumber);
				break;
			}
			default: {
				throw new Error("Unknown state");
			}
		}
		this._log("PREV:END");
		this.render();
	}

	onNext() {
		this._log("NEXT:START");
		switch (this.state) {
			case STATES.BEFORE: {
				this.stepNumber = 0;
				this.state = STATES.NAVIGATING;
				etEvents.fire("nextStep", this.stepNumber);
				break;
			}
			case STATES.NAVIGATING: {
				if (this.stepNumber < this._steps.length - 1) {
					this.stepNumber++;
					etEvents.fire("nextStep", this.stepNumber);
				} else if (this.stepNumber === this._steps.length - 1) {
					this.onStopTimer();
					this.stepNumber = null;
					this.state = STATES.AFTER;
					etEvents.fire("nextStep", this.stepNumber);
				} else {
					throw new Error("Can't move next");
				}
				break;
			}
			case STATES.AFTER: {
				throw new Error("Next button should not be visible");
				break;
			}
			default: {
				throw new Error("Unknown state");
			}
		}
		this._log("NEXT:END");
		this.render();
	}

	loadDemos(demos, firstDemo) {
		this.sampleSelector.loadDemos(demos, firstDemo);
		this.render();
	}

	render() {
		this._log("RENDER");

		// Hide all
		this.btnReset.hide();
		this.btnPrevArrow.hide();
		this.btnNextArrow.hide();
		this.btnTimerStop.hide();
		this.btnTimerStart.hide();

		// Show as needed
		switch (this.state) {
			case STATES.BEFORE: {
				this.btnNextArrow.show();
				this.btnTimerStart.show();
				break;
			}
			case STATES.NAVIGATING: {
				this.btnReset.show();
				if (this.timer) {
					this.btnTimerStop.show();
				} else {
					this.btnTimerStart.show();
				}

				if (this.stepNumber >= 0) {
					this.btnPrevArrow.show();
				}
				if (this.stepNumber < this._steps.length) {
					this.btnNextArrow.show();
				}
				break;
			}
			case STATES.AFTER: {
				this.btnReset.show();
				this.btnPrevArrow.show();
				break;
			}
			default: {
				throw new Error("Unknown state");
			}
		}
	}

	_log(action) {
		// let now = new Date();
		// let msg = {
		// 	now: `${now.toLocaleTimeString("en-US")} (${now.getSeconds()}.${now.getMilliseconds()})`,
		// 	clock: now.getTime(),
		// 	timer: `Timer: ${this.timer ? "Running" : "Stopped"}`,
		// 	stepsLength: this._steps ? this._steps.length : "N/A",
		// };
		// console.groupCollapsed(`${action} | ${msg.clock} | ${this.state} | ${this.stepNumber} of ${msg.stepsLength} | ${msg.timer} | ${msg.now}`);
		// console.trace(); // hidden in collapsed group
		// console.groupEnd();
	}
}
