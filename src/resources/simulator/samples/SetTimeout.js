// prettier-ignore
function timer(delay) {
	console.log("2");
	setTimeout(
		function () {
			console.log("3");
		},
		delay);
	console.log("4");
}

console.log("1");
timer(2000);
console.log("Done");
