const fs = require('fs');

setInterval(() => {
    fs.unlink('./abcde.js', (err) => {
        if (err) {
            console.error(err);
        }
    });
}, 1000);