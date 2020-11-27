// prettier-ignore
function log(msg) { console.log(msg); }
function myTimer(cb) {
  setTimeout(() => {
    cb(Math.random());
  }, 0);
}
function myPromise() {
  return new Promise((res, rej) => {
    let quality = Math.random();
    Promise.resolve().then(() => {
      console.log('Checking Quality');
      if (quality > 0.1) {
        res(quality);
      } else {
        rej(quality);
      }
    });
    console.log('After Promise');
  });
}
console.log('Start');
myTimer((q) => { log(`C: ${q}`); });
myPromise()
  .then((q) => { log(`T: ${q}`); })
  .catch((err) => { log(`C: ${err}`); })
  .finally(() => { log('Finally'); });
console.log('Finish');