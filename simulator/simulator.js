/* eslint-disable no-undef */
import Controller from './controller.js';

let controller;
let slidesCode = new SlidesCode();
slidesCode.initialize(Reveal);

Reveal.on('ready', (event) => {
	console.log(`Reveal ready: ${JSON.stringify(event)}`);
	if (controller === undefined) {
		let savedData = null;
		let strSaveData = localStorage.getItem('savedData');
		if (strSaveData) {
			savedData = JSON.parse(strSaveData);
		} else {
			savedData = {
				// Initialize at a specific demo, good for quick tests...
				demoNumber: 0
			};
		}
		localStorage.setItem('savedData', JSON.stringify(savedData));
		controller = new Controller(Reveal, slidesCode, savedData);
	}
});

Reveal.on('slidechanged', (event) => {
	console.log(`Reveal slidechanged: ${JSON.stringify(event)}`);
	if (controller) {
		controller.hideNavigationArrows();
	}
});

// Mutation observer
// let oldHREF = ''; //document.location.href;

// // Select the node that will be observed for mutations
// const targetNode = document.querySelector('body');

// // Options for the observer (which mutations to observe)
// // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
// const config = { attributes: false, childList: true, subtree: true };

// // Create an observer instance linked to the callback function
// const observer = new MutationObserver((mutationsList, observer) => {
// 	for (const mutation of mutationsList) {
// 		if (oldHREF != document.location.href) {
// 			let newHREF = document.location.href;
// 			console.log(`HREF changed: Old: ${oldHREF}. New: ${newHREF}`);
// 			oldHREF = newHREF;
// 		}
// 	}
// });

// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);

// // Later, you can stop observing
// // observer.disconnect();
