var co = require("co");
var request = require("request");
const request_koa = require("../../common/request_koa.js")

class brain {
    constructor() {

        this.fetchTodayNews();
    }

    fetchTodayNews() {

        co(function* () {

            var result = yield request_koa({ url: 'http://www.kejilie.com' });
            console.log(result);
        })
    }
}
module.exports = brain;