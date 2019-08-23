const fs = require('fs');
const util = require('util');

const readdirSync = util.promisify(fs.readdir);
const unlinkSync = util.promisify(fs.unlink);
const rmdirSync = util.promisify(fs.rmdir);

readdirSync('./folder')
    .then((dir) => {
        console.log('폴더 내용 확인', dir);
        return unlinkSync('./folder/newFile.js');
    })
    .then(() => {
        console.log('파일 삭제 성공');
        return rmdirSync('./folder');
    })
    .then(() => {
        console.log('폴더 삭제 성공');
    })
    .catch((err) => {
        throw err;
    });