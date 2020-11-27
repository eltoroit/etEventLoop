// prettier-ignore
function timers(counter) {
  for (let i = 0; i < counter; i++) {
    console.log(`Loop #${i}`);
    setTimeout(
      (j) => {
        console.log(`Timer #${j}`);
      }, 1000, i);
  }
  console.log(`Loops Ended`);
}

console.log('Start');
timers(3);
console.log('Finish');
