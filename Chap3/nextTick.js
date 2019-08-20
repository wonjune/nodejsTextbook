setImmediate(() => {
    console.log('immediate');
});

process.nextTick(() => {
    console.log('nextTick');
});

setTimeout(() => {
    console.log('timeout');
}, 0);

const promise = new Promise((resolve, reject) => {
    resolve();
});
promise.then(() => {
    console.log('promise');
});