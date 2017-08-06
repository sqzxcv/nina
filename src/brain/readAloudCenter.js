const co = require (co)
const request_koa = require("../../common/request_koa.js")

class ReadAloudCenter {

    
    constructor() {

    }
    login() {

        var appkey = "6NCOZQHM7f2bGzc9tKemZovU"
        var secretkey = "X0uXNGMIUkiockwY8Q16P6B41E3Xc98a"
        var url = ` https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials
        &client_id=${appkey}&client_secret=${secretkey}`
        co(function* (){

            var result = JSON.parse(request_koa({url:url}))
            var token = result["access_token"]
            var ttsUrl = `http://tsn.baidu.com/text2audio?lan=zh
            &tok=${token}&ctp=1&cuid=aaaaaaaaaaaa&tex=${content}`
        })
    }
}

module.exports = ReadAloudCenter;