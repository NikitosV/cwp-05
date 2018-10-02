const fs = require('fs');
let articles = require("../articles.json");

module.exports = {
    createComment,
    deleteComment
};

function createComment(req, res, payload, cb) {
    let d = new Date();
    let exist = 0;
    if (payload.articleId !== undefined || payload.text !== undefined || payload.author !== undefined) {
        for (i = 0; i < articles.length; i++) {
            if (articles[i].id == payload.articleId) {
                payload.id = articles[i].comment.length + 1;
                payload.date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
                articles[i].comment.push(payload);
                exist = 1;
                fs.writeFile("./articles.json", JSON.stringify(articles), "utf8", function () { });
                cb(null, "created");
            }
            if (i == articles.length && exist == 0) {
                cb({code: 404, message: 'Not found'});
            }
        }
    }
    else {
        cb(null, "{code: 400, message: Request invalid}");
    }
}

function ExistArticleID(id, articleId) { //сначала id комментария, потом id новости
    return new Promise((resolve, reject) => {
        let existArc = 0;
        let exist = 0;
        for (i = 0; i < articles.length; i++) {
            if (articles[i].id == articleId) {
                for (j = 0; j < articles[i].comment.length; j++) {
                    if (articles[i].comment[j].id == id) {
                        articles[i].comment.splice(j, 1);
                        resolve("exist");
                        existArc = 1;
                    }
                    if (j == articles.length && existArc == 0) {
                        reject("error");
                    }
                }
                exist = 1;
            }
            if (i == articles.length && exist == 0) {
                reject("error");
            }
        }
    })
}

function deleteComment(req, res, payload, cb) {
    ExistArticleID( payload.id, payload.articleId).then(
        exist => {
            console.log("exist");
            fs.writeFile("./articles.json", JSON.stringify(articles), "utf8", function () { });
            cb(null, {"msg": "Delete success"});
        },
        error => {
            console.log("error");
            cb({code: 404, message: 'Not found'});
        })
}