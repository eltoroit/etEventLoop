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
    Promise.resolve()
      .then(() => {
        log('Checking Quality');
        if (quality > 0.1) {
          res(quality);
        } else {
          rej(quality);
        }
      });
    log('After Promise');
  });
}
log('Start');
myTimer((q) => { log(`C: ${q}`); });
log('After timer');
myPromise()
  .then((q) => { log(`T: ${q}`); })
  .catch((err) => { log(`C: ${err}`); })
  .finally(() => { log('Finally'); });
log('Finish');