import * as UI from './UI.js';
import { etEvents } from './ET_Events.js';
import { Data, Navigator } from './helpers.js';

export default class Controller {
	// System data
	reveal = null;
	slidesCode = null;

	// My data
	data = null;
	cmpCode = null;
	navigator = null;
	cmpSpinner = null;
	cmpBoxes = new Map();
	hardNavigation = true;
	requestedNavigation = false;

	constructor(reveal, slidesCode, savedData) {
		// System data
		this.reveal = reveal;
		this.slidesCode = slidesCode;

		// My data
		this.data = new Data();
		this.navigator = new Navigator();

		// Components
		this.cmpCode = new UI.Code();
		this.cmpSpinner = new UI.Spinner();
		this.cmpBoxes.set('UI.Stack', new UI.Stack());
		this.cmpBoxes.set('UI.WebAPI', new UI.WebAPI());
		this.cmpBoxes.set('UI.TaskQueue', new UI.TaskQueue());
		this.cmpBoxes.set('UI.MicrotaskQueue', new UI.MicrotaskQueue());
		this.cmpBoxes.set('UI.Console', new UI.Console());

		// Register events
		etEvents.on('reset', async (event) => {
			let demoNumber = this.data.demoNumber;
			this.data.demoNumber = null;
			this.onChangeDemo(demoNumber);
		});
		etEvents.on('prev', async (event) => {
			this.navigator.onPrev();
		});
		etEvents.on('next', async (event) => {
			this.navigator.onNext();
		});
		etEvents.on('timerStart', async (event) => {
			this.navigator.autoNext.enabled = false;
			this.navigator.onStartTimer();
		});
		etEvents.on('timerStop', async (event) => {
			this.navigator.autoNext.enabled = false;
			this.navigator.onStopTimer();
		});
		etEvents.on('spinner', async (isShow) => {
			if (isShow) {
				this.cmpSpinner.show();
			} else {
				this.cmpSpinner.hide();
			}
		});
		etEvents.on('highlightCode', async (event) => {
			// debugger;
			// this.reveal.getPlugins().highlight.highlightBlock(this.cmpCode.cmp);
			// this.reveal.initialize({ plugins: [RevealHighlight], controls: false }).then((data) => {
			// 	this.cmpCode.scroll(0, 0);
			// 	etEvents.fireNow("spinner", false);
			// });
			this.slidesCode.initialize(reveal).then((data) => {
				etEvents.fireNow('spinner', false);
				this.hideNavigationArrows();
			});
		});
		etEvents.on('prevStep', (stepNumber) => this.onChangeStep.call(this, stepNumber, false));
		etEvents.on('nextStep', (stepNumber) => this.onChangeStep.call(this, stepNumber, true));
		etEvents.on('demoSelected', this.onChangeDemo.bind(this));
		Reveal.on('fragmentshown', this.validateNavigation.bind(this));
		Reveal.on('fragmenthidden', this.validateNavigation.bind(this));

		// Initialize data
		this.data
			.read()
			.then((demos) => {
				return this.navigator.loadDemos(demos, savedData.demoNumber);
			})
			.then(() => {
				// Load first demo
				this.data.demoNumber = null;
				this.onChangeDemo(savedData.demoNumber);
			});
	}

	async onChangeDemo(demoNumber) {
		demoNumber = Number(demoNumber);
		if (this.data.demoNumber !== demoNumber) {
			// Save demoNumber in local storage
			let savedData = JSON.parse(localStorage.getItem('savedData'));
			savedData.demoNumber = demoNumber;
			localStorage.setItem('savedData', JSON.stringify(savedData));

			// Clear UI and data
			this.cmpCode.reset();
			this.cmpBoxes.forEach((cmp, key) => {
				cmp.reset();
			});
			this.data.reset();
			this.navigator.reset();

			// Switch demo
			let demo = await this.data.selectDemo(demoNumber, this.navigator);
			this.navigator.steps = this.data.steps;
			await this.cmpCode.load(demo);
			this.navigator.render();
			this.requestedNavigation = true;
			this.reveal.navigateFragment(-1);
		}
	}

	async onChangeStep(stepNumber, isNext) {
		this.requestedNavigation = true;
		this.data.selectStep(stepNumber);
		if (stepNumber === null) {
			this.hardNavigation = true;
			this.reveal.navigateFragment(-1);
		} else if (this.hardNavigation) {
			this.reveal.navigateFragment(stepNumber);
			this.hardNavigation = false;
		} else {
			if (isNext) {
				this.reveal.nextFragment();
			} else {
				this.reveal.prevFragment();
			}
		}

		// Update boxes
		let previousStep = this.data.getStep(this.data.oldStepNumber);
		let currentStep = this.data.getStep(this.data.stepNumber);
		this._log(previousStep, currentStep, isNext);

		this.cmpBoxes.forEach((cmp, key) => {
			cmp.processStep(previousStep, currentStep, isNext, this.navigator);
		});
		// }
	}

	validateNavigation(event) {
		if (!this.requestedNavigation) {
			this.requestedNavigation = true;
			this.reveal.navigateFragment(this.data.stepNumber);
			console.error('Fragment change was not requested!');
		}
		this.requestedNavigation = false;
	}

	hideNavigationArrows() {
		let isCustomSlide = Reveal.getCurrentSlide().dataset.etId === 'slide';
		// document.querySelectorAll("button[class~='navigate-left']")
		let cmps = document.querySelectorAll('aside.controls');

		// Hide/Show Reveal Prev/Next buttons
		cmps.forEach((cmp) => {
			if (isCustomSlide) {
				cmp.classList.add('slds-hide');
			} else {
				cmp.classList.remove('slds-hide');
			}
		});
	}

	_log(previousStep, currentStep, isNext) {
		let now = new Date();
		let msg = {
			now: `${now.toLocaleTimeString('en-US')} (${now.getSeconds()}.${now.getMilliseconds()})`,
			clock: now.getTime(),
			move: isNext ? 'NEXT' : 'BACK',
			stepNumber: this.data.stepNumber
		};
		let steps = {
			previousStep: JSON.stringify(previousStep),
			currentStep: JSON.stringify(currentStep)
		};
		console.groupCollapsed(
			`CHANGE_STEP | ${msg.clock} | ${msg.move} to ${msg.stepNumber} (${previousStep ? previousStep.index : 'null'} => ${currentStep ? currentStep.index : 'null'}) | ${msg.now}`,
			steps
		);
		console.trace(); // hidden in collapsed group
		console.groupEnd();
	}
}
