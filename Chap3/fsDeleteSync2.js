const fs = require('fs');
const util = require('util');

const readdirSync = util.promisify(fs.readdir);
const unlinkSync = util.promisify(fs.unlink);
const rmdirSync = util.promisify(fs.rmdir);

(async () => {
    try {
        const dir = await readdirSync('./folder');
        console.log('폴더 내용 확인', dir);
        await unlinkSync('./folder/newFile.js');
        console.log('파일 삭제 성공');
        await rmdirSync('./folder');
        console.log('폴더 삭제 성공');
    } catch (err) {
        throw err;
    }
})();