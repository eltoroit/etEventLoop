// prettier-ignore
function timer(delay) {
    console.log(`Delay: ${delay}ms`);
    setTimeout(
        () => {
            console.log('Timed out');
        },
        delay
    );
    console.log('Returning');
}

console.log('Start');
timer(0);
console.log('Done');
