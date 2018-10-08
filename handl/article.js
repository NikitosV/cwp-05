const fs = require('fs');
let articles = require("../articles.json");

module.exports = {
    readall,
    read,
    createArticle,
    update,
    deleteArticle
};

function readall(req, res, payload, cb) {
    cb(null, articles);
}

function read(req, res, payload, cb) {
    let result;
    for (i = 0; i < articles.length; i++) {
        if (articles[i].id == payload.id) {
            result = articles[i];
        }
    }
    if (result != undefined) {
        cb(null, result);
    }
    else {
        cb(null, result);
    }
}

function createArticle(req, res, payload, cb) {
    let d = new Date();
    if (payload.title !== undefined || payload.text !== undefined || payload.author !== undefined) {
        payload.id = articles.length + 1;
        payload.comment = [];
        payload.date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
        articles.push(payload);
        fs.writeFile("./articles.json", JSON.stringify(articles), "utf8", function () { });
        cb(null, "created");
    }
    else {
        cb(null, "{code: 400, message: Request invalid}");
    }
}

function ExistID(id) {
    return new Promise((resolve, reject) => {
        let exist = 0;
        for (i = 0; i < articles.length; i++) {
            if (articles[i].id == id) {
                resolve("exist");
                exist = 1;
            }
            if (i == articles.length && exist == 0) {
                reject("error");
            }
        }
    })
}

function update(req, res, payload, cb) {
    if (payload.id !== undefined) {
        ExistID(payload.id).then(
            exist => {
                for (i = 0; i < articles.length; i++) {
                    if (articles[i].id === payload.id) {
                        if (payload.title !== undefined)
                            articles[i].title = payload.title;
                        if (payload.text !== undefined)
                            articles[i].text = payload.text;
                        if (payload.author !== undefined)
                            articles[i].author = payload.author;
                        if (payload.date !== undefined)
                            articles[i].date = payload.date;
                        let result = articles[i];
                        fs.writeFile("./articles.json", JSON.stringify(articles), "utf8", function () { });
                        cb(null, "update");
                    }
                }
            },
            error => {
                cb({code: 404, message: 'Not found'});
            }
        )
    }
    else {
        cb(null, "{code: 400, message: Request invalid}");
    }
}

function deleteArticle(req, res, payload, cb) {
    ExistID(payload.id).then(
        exist => {
            articles.splice(articles.findIndex(index => index.id === payload.id), 1);
            fs.writeFile("./articles.json", JSON.stringify(articles), "utf8", function () { });
            cb(null, {"msg": "Delete success"});
        },
        error => {
            cb({code: 404, message: 'Not found'});
        })
}