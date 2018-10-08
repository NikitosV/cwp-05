const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const articles_handl = require('./handl/article');
const comments_handl = require('./handl/comment');

const handlers = {
    '/api/articles/readall': articles_handl.readall,
    '/api/articles/read': articles_handl.read,
    '/api/articles/update': articles_handl.update,
    '/api/articles/create': articles_handl.createArticle,
    '/api/articles/delete': articles_handl.deleteArticle,
    '/api/comments/create': comments_handl.createComment,
    '/api/comments/delete': comments_handl.deleteComment,
};

const log = "./log.txt";

const server = http.createServer((req, res) => {
    parseBodyJson(req, (err, payload) => {
        const handler = getHandler(req.url);

        handler(req, res, payload, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end( JSON.stringify(err) );

                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end( JSON.stringify(result) );
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
    let body = [];

    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        Log(req.url + '\r\n' + body);
        let params = JSON.parse(body);

        cb(null, params);
    });
}

function Log(data) {
    ReadLog().then(
        result => {
            let date = new Date();
            fs.writeFile(log,result + date.toLocaleString() + ": \r\n" + data + '\r\n', "utf8", function () {
            });
        })
}

function ReadLog() {
    return new Promise((resolve) => {
        fs.readFile(log, (err, data) => {
            if (err) throw err;
            resolve(data);
        });
    })
}