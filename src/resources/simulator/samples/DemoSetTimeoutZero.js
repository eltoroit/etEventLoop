// prettier-ignore 🤔
function timer(delay) {
    console.log('2');
    setTimeout(() => {
        console.log('3');
    }, delay);
    console.log('4');
}

console.log('1');
timer(0);
console.log('Done');
