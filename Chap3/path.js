const path = require('path');

const string = __filename;

console.log('path.sep : ', path.sep);
console.log('path.delimeiter : ', path.delimiter);
console.log('---------------------------------------------------');
console.log('path.dirname() : ', path.dirname(string));
console.log('path.extname() : ', path.extname(string));
console.log('path.basename() : ', path.basename(string));
console.log('path.basename() : ', path.basename(string, path.extname(string)));
console.log('---------------------------------------------------');
console.log('path.parse() : ', path.parse(string));
console.log('path.format() : ', path.format({
    dir: 'C:\\30.Study\\nodejsTextbook\\Chap3',
    name: 'path',
    ext: '.js'
}));
console.log('path.normalize() : ', path.normalize('C:\\\\\\30.Study\\////nodejsTextbook\\Chap3'));
console.log('---------------------------------------------------');
console.log('path.isAbsolute() ; ', path.isAbsolute('C:\\'));
console.log('path.isAbsoulte() : ', path.isAbsolute('./home'));
console.log('---------------------------------------------------');
console.log('path.relative() : ', path.relative('C:\\30.Study\\nodejsTextbook\\Chap3\\path.js', 'C:\\'));
console.log('path.join()', path.join(__dirname, '..', '..', '..', '/30.Study', '.', '/nodejsTextbook'));
console.log('path.resolve() :', path.resolve(__dirname, '..', '..', 'SWPro','.'));
console.log('path.resolve() :', path.resolve(__dirname, '..', '..', '/SWPro','.'));