const fs = require('fs');

const readStream = fs.createReadStream('./readme3.txt', { highWaterMark: 16});
const data = [];

readStream.on('data', (chunk) => {
    data.push(chunk);
    console.log('data: ', chunk, chunk.length);
    console.log('read: ', Buffer.concat(data).toString());
});

readStream.on('end', () => {
    console.log('end: ', Buffer.concat(data).toString());
});

readStream.on('err', (err) => {
    console.log('error: ', err);
});