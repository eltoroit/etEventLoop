function log(msg) {
	console.log(msg);
}
function myTimer(cb) {
  setTimeout(() => {
    cb(0.98765);
  }, 0);
  log('After timer');
}
function myPromise() {
  return new Promise((res, rej) => {
    let quality = 0.01234;
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
myTimer((q) => { log(`TIMER: ${q}`); });
myPromise()
  .then((q) => { log(`✅: ${q}`); })
  .catch((err) => {log(`❌: ${err}`);});
log('Finish');