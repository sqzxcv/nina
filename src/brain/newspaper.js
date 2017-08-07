// const request_koa = require("../../common/request_koa.js")

const util = require('util');
const request = util.promisify(require("request"))
const text2speech = require('./text2speech')

var retryCount = 0
const newspaper = async (pasreurl) => {
    
    var options = { url: `http://localhost:8082/presedocument?url=${pasreurl}` }
    try {
        const {body,response} = await request(options)
        return JSON.parse(body)
    } catch (error) {
        console.error(error)
        if (retryCount < 5) {
            return newspaper(pasreurl)
            retryCount ++
        } else {
            return ""
        }
    }
    // todo: 网络链接错误处理
}

const audioFromURL = async (pasreurl) => {

    var dict = await newspaper(pasreurl)
    var audioPath = await text2speech(dict['content'])
    return audioPath
}

module.exports = audioFromURL

// console.log(audioFromURL("http://www.kejilie.com/qq/article/ayURji.html"))