const config = require('../../config')
const bluebird = require('bluebird')
const mysql = require('mysql')
bluebird.promisifyAll(require("mysql/lib/Connection").prototype);
bluebird.promisifyAll(require("mysql/lib/PoolConnection").prototype)
bluebird.promisifyAll(require("mysql/lib/Pool").prototype);
const moment = require("moment")

/**
 * @param  {} catalog_id 目录 id
 * 1=科技数码:科技 + 数码 + 汽车
 * 2=金融股票:产经 + 房产 + 股票 + 金融
 * 3=娱乐 + 体育 + 脱口秀
 * 4=社会+军事:国内 + 国际 + 军事 + 社会
 * 5=其他:
 * @param  {} startid
 * @param  {} count
 */
const tingnewsResponse_v1 = async(catalog_id, startid, count) => {

    var pool = mysql.createPool({
        host: config['dbhost'],
        user: config['dbuser'],
        password: config['dbpwd'],
        database: "Nina",
        connectionLimit: 100,
        port: "3306",
        waitForConnections: false
    });
    try {
        var connection = await pool.getConnectionAsync();
    } catch (error) {
        console.error(error)
    }
    var sql = ""
    if (startid <= 0) {
        sql = `select * from radioDB where collect_time <=${moment().unix() + 60 * 60 * 100} and audio is not NULL and catalogid= ${catalog_id} order by doc_id desc limit ${count};`
    } else {
        sql = `select * from radioDB where collect_time <=${moment().unix() + 60 * 60 * 100} and doc_id <${startid} and audio is not NULL and catalogid=${catalog_id} order by doc_id desc limit ${count};`
    }
    try {
        var results = await connection.queryAsync(sql)
        if (results.length == 0) {
            console.warn("没有查询到数据")
        }
        // await connection.releaseAsync();
        await pool.endAsync();
    } catch (error) {
        console.error(error)
        results = []
    }
    var name = ""
    switch (parseInt(catalog_id)) {
        case 1:
            name = "科技数码"
            break;
        case 2:
            name = "金融股票"
            break
        case 2:
            name = "娱乐体育"
            break
        case 2:
            name = "社会军事"
            break
        default:
            break;
    }
    return {"title":name, "results":results}
}

module.exports = tingnewsResponse_v1