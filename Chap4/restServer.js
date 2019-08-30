const http = require('http');
const fs = require('fs');

const users = {};

http.createServer((req, res) => {
    //GET
    if (req.method === 'GET') {

        //Home 화면 : restFront.html 출력
        if (req.url === '/') {
            return fs.readFile('./restFront.html', (err, data) => {
                if (err) {
                    throw err;
                }
                res.end(data);
            })
        } 
        //About 화면 : about.html 출력 
        else if (req.url == '/about') {
            return fs.readFile('./about.html', (err, data) => {
                if (err){
                    throw err;
                }
                res.end(data);
            })
        }
        //user 리스트 요청(AJAX)
        else if (req.url === '/users'){
            return res.end(JSON.stringify(users));
        }
        //그외의 GET 요청은 CSS나 JS 등을 요청하므로 찾아서 보내줌(없으면 404 처리)
        return fs.readFile(`.${req.url}`, (err, data) => {
            if (err) {
                res.writeHead(404, 'NOT FOUND');
                return res.end('NOT FOUND');
            }
            return res.end(data);
        })
    }
    //POST 
    else if (req.method === 'POST') {

        //user 등록
        if (req.url === '/users'){
            let body = '';
            //readStream 으로 들어오는 요청본문을 처리
            req.on('data', (data) => {
                body += data;
            });
            return req.on('end', () => {
                console.log('POST 본문(Body): ', body);
                const { name } = JSON.parse(body);
                const id = +new Date();
                users[id] = name;
                res.writeHead(201);
                res.end('등록 성공');
            });
        }
    }
    //PUT
    else if (req.method === 'PUT') {

        //user 수정
        if (req.url.startsWith('/users/')){
            const key = req.url.split('/')[2];
            let body = '';
            //readStream 으로 들어오는 요청본문을 처리
            req.on('data', (data) => {
                body += data;
            });
            return req.on('end', () => {
                console.log('PUT 본문(Body): ', body);
                users[key] = JSON.parse(body).name;
                return res.end(JSON.stringify(users));
            })
        }
    }
    //DELETE
    else if (req.method === 'DELETE') {

        //user 삭제
        if (req.url.startsWith('/users/')){
            const key = req.url.split('/')[2];
            delete users[key];
            return res.end(JSON.stringify(users));
        }
    }
    //그 외의 요청은 404 처리
    res.writeHead(404, 'NOT FOUND');
    return res.end('NOT FOUND');
}).listen(8085, () => {
    console.log("8085번 포트에서 서버 대기 중입니다.");
})