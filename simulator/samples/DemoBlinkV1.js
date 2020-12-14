function onVersion1() {
	let counter = 0;
	let maxTimes = 10;
	while (counter < maxTimes) {
		counter++;
		console.log(`Counter: ${counter}`);
		setTimeout((TCounter) => {
			console.log(`Flip: ${TCounter}`);
		}, 500, counter );
	}
}
onVersion1();
console.log("Done");