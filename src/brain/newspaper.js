// const request_koa = require("../../common/request_koa.js")

const util = require('util');
const request = util.promisify(require("request"))
const text2speech = require('./text2speech')
const config = require('../../config')

var retryCount = 0
const newspaper = async(pasreurl) => {
    
    var options = {
        url: `${config['newspaper']}${encodeURIComponent(pasreurl)}`
    }
    try {
        const {
            body,
            response
        } = await request(options)
        return JSON.parse(body)
    } catch (error) {
        console.error(error)
        if (retryCount < 5) {
            return newspaper(pasreurl)
            retryCount++
        } else {
            return ""
        }
    }
    // todo: 网络链接错误处理
}

const audioConvertFromURL = async(pasreurl) => {

    var dict = await newspaper(pasreurl)
    var audioPath = await text2speech(dict['content'])
    dict['audio'] = audioPath
    return dict
}

const audiosConvertFromURLs = async(links) => {
    var urls = links.slice(0)
    var mp3urls = []
    for (var i = 0; i < urls.length; i++) {
        mp3urls.push(await audioConvertFromURL(links[i]))
    }
    return mp3urls
}

module.exports = audiosConvertFromURLs

// console.log(audioFromURL("http://www.kejilie.com/qq/article/ayURji.html"))