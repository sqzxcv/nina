// const request_koa = require("../../common/request_koa.js")

const util = require('util');
const request = util.promisify(require("request"))
const text2speech = require('./text2speech')
const config = require('../../config')
const bluebird = require('bluebird')
const mysql = require('mysql')
bluebird.promisifyAll(require("mysql/lib/Connection").prototype);
bluebird.promisifyAll(require("mysql/lib/Pool").prototype);
const moment = require("moment")


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
    var pool = mysql.createPool({
        host: config['dbhost'],
        user: config['dbuser'],
        password: config['dbpwd'],
        database: "nina",
        connectionLimit: 100,
        port: "3306",
        waitForConnections: false
    });
    for (var i = 0; i < urls.length; i++) {
        mp3urls.push(await audioConvertFromURL(links[i]))
    }
    var audioids = []
    try {
        var connection = await pool.getConnectionAsync();        
    } catch (error) {
        console.error(error)
    }
    for (var index = 0; index < mp3urls.length; index++) {
        var element = mp3urls[index];
        // SELECT @@IDENTITY
        try {
            var originRes = await connection.queryAsync(`select contentHtml from document where url='${element['url']}'`)
            var contentHtml = ''
            if (originRes.length != 0) {
                contentHtml = originRes[0]['contentHtml']
            }
            var results = await connection.queryAsync(`insert into ugc_document(url,content,news_time,title,audio,isugc,collect_time,contentHtml)
             values('${element['url']}','${element['content']}',${moment(element['news_time']).unix()},
            '${element['title']}','${element['audio']}',1,${moment().unix()}, '${contentHtml}'
            ) ON DUPLICATE KEY UPDATE audio='${element['audio']}',collect_time=${moment().unix()}, isugc=1, contentHtml='${contentHtml}'`)
            if (results.length != 0) {
                audioids.push(results['insertId']);
            } else {
                console.log("文档插入失败")
            }
        } catch (error) {
            console.error(error);
            continue;
        }
        
    }
    connection.release()

    return audioids
}

module.exports = audiosConvertFromURLs

// console.log(audioFromURL("http://www.kejilie.com/qq/article/ayURji.html"))