import { etEvents } from "./ET_Events.js";

class Base {
	_cmp = null;
	selector = null;

	constructor(selector) {
		if (!selector) throw new Error("Selector is not defined");
		this.selector = selector;
	}

	get cmp() {
		let cmps = null;

		if (this._cmp) {
			return this._cmp;
		}

		this._cmp = null;
		try {
			cmps = document.querySelectorAll(this.selector);
			if (cmps.length !== 1) {
				throw new Error(`Failed to load component: ${this.selector}`);
			}
			this._cmp = cmps[0];
		} catch (err) {
			alert(err);
		}

		return this._cmp;
	}

	deleteChildren() {
		while (this.cmp.hasChildNodes()) {
			this.cmp.removeChild(this.cmp.childNodes[0]);
		}
	}
}

// Boxes
class Box extends Base {
	lines = [];
	boxName = "";
	addOnTop = false;

	constructor(selector) {
		super(selector);
	}

	reset() {
		this.lines = [];
		this.cmp.innerHTML = "";
		this.cmp.style.backgroundColor = "#fff";
	}

	processStep(previousStep, currentStep, isNext) {
		console.log(`Can't process step for [${this.selector}] yet`);
	}

	addLineTop(text) {
		this.lines.unshift(text);
		this.updateCmp();
	}

	addLineBottom(text) {
		this.lines.push(text);
		this.updateCmp();
	}

	removeLine(text) {
		this.lines = this.lines.filter((line) => line !== text);
		this.updateCmp();
	}

	splitInstruction(text) {
		return text.split("|");
	}

	updateCmp() {
		this.cmp.innerHTML = this.lines.join("\n");
		if (this.addOnTop) {
			this.cmp.scroll(0, 0);
		} else {
			this.cmp.scroll(0, this.cmp.scrollHeight - this.cmp.clientHeight);
		}
		this.cmp.style.backgroundColor = "#a1d1dc";
		// setTimeout(() => {
		// 	this.cmp.style.backgroundColor = "#fff";
		// }, 500);
	}

	getStep(previousStep, currentStep, isNext, box) {
		let instruction = null;
		let step = isNext ? currentStep : previousStep;
		if (step && step[box]) {
			instruction = this.splitInstruction(step[box]);
		}
		return instruction;
	}

	processStep(previousStep, currentStep, isNext) {
		this.cmp.style.backgroundColor = "#fff";
		let instruction = this.getStep(previousStep, currentStep, isNext, this.boxName);
		if (instruction) {
			if (isNext) {
				if (instruction[0] === "+") {
					if (this.addOnTop) {
						this.addLineTop(instruction[1]);
					} else {
						this.addLineBottom(instruction[1]);
					}
				} else {
					this.removeLine(instruction[1]);
				}
			} else {
				if (instruction[0] === "+") {
					this.removeLine(instruction[1]);
				} else {
					if (this.addOnTop) {
						this.addLineTop(instruction[1]);
					} else {
						this.addLineBottom(instruction[1]);
					}
				}
			}
		}
	}
}

export class Code extends Box {
	code = null;
	loaded = false;

	constructor() {
		super(`pre[data-et-id="code"]`);
	}

	async load(demo) {
		this.loaded = false;
		etEvents.fire("spinner", true);
		let response = await fetch(`./samples/${demo.code}.js`);
		this.code = await response.text();
		if (this.code) {
			this.code = this.code.replaceAll("	", "  ").trim(); // Tabs for 2 spaces and remove surrounding whitespace

			// Remove "prettier-ignore"
			let lines = this.code.split("\n");
			lines = lines.map((line) => {
				if (line.includes("prettier-ignore")) {
					return "// Some comments";
				} else {
					return line;
				}
			});
			this.code = lines.join("\n");

			// Make HTML
			this.deleteChildren();
			let htmlCode = document.createElement("code");
			htmlCode.innerHTML = this.code;
			// htmlCode.dataset.lineNumbers = `1-${this.code.split("\n").length}` + demo.lines;
			htmlCode.dataset.lineNumbers = `1` + demo.lines;
			htmlCode.dataset.fragmentIndex = "0";
			this.cmp.appendChild(htmlCode);
			this.loaded = true;
			etEvents.fire("highlightCode");
		} else {
			throw new Error("No code to be loaded");
		}
	}

	reset() {
		// Nothing :-)
	}
}

export class Stack extends Box {
	constructor() {
		super(`code[data-et-id="stack"]`);
		this.addOnTop = true;
		this.boxName = "stack";
	}
}

export class WebAPI extends Box {
	constructor() {
		super(`code[data-et-id="webAPI"]`);
		this.addOnTop = false;
		this.boxName = "webAPI";
	}
}

export class TaskQueue extends Box {
	constructor() {
		super(`code[data-et-id="taskQueue"]`);
		this.addOnTop = false;
		this.boxName = "taskQueue";
	}
}

export class MicrotaskQueue extends Box {
	constructor() {
		super(`code[data-et-id="microtaskQueue"]`);
		this.addOnTop = false;
		this.boxName = "microtaskQueue";
	}
}

export class Console extends Box {
	constructor() {
		super(`code[data-et-id="console"]`);
		this.addOnTop = false;
		this.boxName = "console";
	}
}

// Buttons
class Button extends Base {
	constructor(selector) {
		super(selector);
	}

	hide() {
		this.cmp.classList.add("slds-hide");
	}

	show() {
		this.cmp.classList.remove("slds-hide");
	}
}

export class Reset extends Button {
	constructor() {
		super(`div[data-et-id="reset"]`);
		this.cmp.addEventListener("click", this.onClick.bind(this));
	}

	onClick() {
		etEvents.fire("reset");
	}
}

export class Spinner extends Button {
	constructor() {
		super(`div[data-et-id="spinner"]`);
	}
}

export class PrevArrow extends Button {
	constructor() {
		super(`div[data-et-id="prevArrow"]`);
		this.cmp.addEventListener("click", this.onClick.bind(this));
	}

	onClick(event) {
		etEvents.fire("prev");
	}
}

export class NextArrow extends Button {
	constructor() {
		super(`div[data-et-id="nextArrow"]`);
		this.cmp.addEventListener("click", this.onClick.bind(this));
	}

	onClick(event) {
		etEvents.fire("next");
	}
}

export class TimerStart extends Button {
	constructor() {
		super(`div[data-et-id="timerStart"]`);
		this.cmp.addEventListener("click", this.onClick.bind(this));
	}

	onClick(event) {
		etEvents.fire("timerStart");
	}
}

export class TimerStop extends Button {
	constructor() {
		super(`div[data-et-id="timerStop"]`);
		this.cmp.addEventListener("click", this.onClick.bind(this));
	}

	onClick(event) {
		etEvents.fire("timerStop");
	}
}

export class SampleSelector extends Base {
	constructor() {
		super(`select[data-et-id="sampleSelector"]`);
		this.cmp.addEventListener("change", this.onChange.bind(this));
	}

	async loadDemos(demos, firstDemo) {
		this.deleteChildren();
		demos.forEach((demo, idx) => {
			let option = document.createElement("option");
			option.value = idx;
			option.innerHTML = demo.name;
			this.cmp.appendChild(option);
		});
		this.cmp.selectedIndex = firstDemo;
	}

	onChange() {
		etEvents.fire("demoSelected", this.cmp.value);
	}
}
