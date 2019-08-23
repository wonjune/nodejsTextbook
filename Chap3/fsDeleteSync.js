const fs = require('fs');

const promise = new Promise((resolve, reject) => {
    fs.readdir('./folder', (err, dir) => {
        if (err) {
            throw err;
        }else{
            console.log('폴더 내용 확인', dir);
            resolve();
        }
    });
})

promise.then((message) => {
    fs.unlink('./folder/newFile.js', (err) => {
        if (err) {
            throw err;
        }
        console.log('파일 삭제 성공');
        return new Promise((resolve, reject) => {
            resolve('파일 삭제 성공');
        });
    });
}).then((message2) => {
    fs.rmdir('./folder', (err) => {
        if (err) {
            throw err;
        }
        console.log('폴더 삭제 성공');
    });
});