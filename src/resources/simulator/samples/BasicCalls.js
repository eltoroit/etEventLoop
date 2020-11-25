// prettier-ignore
function multiply(a, b) {
	let output = a * b;
	return output;
}

function square(n) {
	let output = multiply(n, n);
	return output;
}

function printSquare(n) {
	let squared = square(n);
	console.log(squared);
}

printSquare(4);
console.log("Done");
