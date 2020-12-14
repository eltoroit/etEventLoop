function onVersion2() {
	let counter = 0;
	let maxTimes = 10;
	const loop = (LCounter) => {
		console.log(`Flip: ${LCounter}`);
		setTimeout((TCounter) => {
			console.log(`TCounter: ${TCounter}`);
			if (TCounter < maxTimes) {
				loop(TCounter);
			} else {
				console.log("Done");
			}
		}, 500, LCounter + 1);
	};
	loop(counter + 1);
}
onVersion2();
console.log("Flipping...");