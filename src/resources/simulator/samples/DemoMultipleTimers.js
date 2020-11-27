// prettier-ignore ... 12345678.1.2345678.2
function timers(counter) {
    for (let i = 0; i < counter; i++) {
        console.log(counter);
    }
}

console.log('Start');
timers(3);
console.log('Finish');
