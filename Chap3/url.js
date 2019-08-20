const url = require('url');

console.log('------------------WHATWG URL--------------------');
const URL = url.URL;
const myURL = new URL('http://www.gilbut.co.kr/book/bookLIst.aspx?sercate1=001001000#anchor');
console.log('new URL() : ', myURL);
console.log('url.format() : ', url.format(myURL));
console.log('------------------------------------------------');

console.log('-------------------NODE URL---------------------');
const parsedURL = url.parse('http://www.gilbut.co.kr/book/bookLIst.aspx?sercate1=001001000#anchor');
console.log('url.parse() : ', parsedURL);
console.log('url.format() : ', url.format(parsedURL));
console.log('------------------------------------------------');