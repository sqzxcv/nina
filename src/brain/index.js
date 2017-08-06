var co = require("co");
var request = require("request");
const request_koa = require("../../common/request_koa.js")
const schedule = require("node-schedule");
const convert = require("koa-convert");

class Brain {
    constructor() {

        //this.fetchTodayNews();
    }

    fetchTodayNews() {

        co(function* () {

            var result = yield request_koa({ url: 'http://localhost:8082/presedocument?url=http://www.mutangxiaxia.com/2017/05/29/untitled-1496050148809/' });
            console.log(result);
        })
    }
    monitorWebSite(url) {

        scheduleJob();
    }

}

//定时任务:
function scheduleJob() {

    //每小时(58分钟)获取最新内容
    var j = schedule.scheduleJob({ minute: 58 }, function () {

        co(function* () {

            yield request_koa({ url: 'http://localhost:8082/monitorwebsite?url=http://www.kejilie.com' });
        })
    });
}

module.exports = Brain;