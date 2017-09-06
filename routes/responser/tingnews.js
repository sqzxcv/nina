const config = require('../../config')
const bluebird = require('bluebird')
const mysql = require('mysql')
bluebird.promisifyAll(require("mysql/lib/Connection").prototype);
bluebird.promisifyAll(require("mysql/lib/Pool").prototype);

const tingnewsResponse = async(startid, count) => {

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
        sql = "select * from document where audio is not NULL and news_time != 0  order by doc_id desc limit " + count + ";"
    } else {
        sql = "select * from document where doc_id <" + startid + " and audio is not NULL and news_time != 0 order by doc_id desc limit " + count + ";"
    }
    var results = await connection.queryAsync(sql)
    if (results.length == 0) {
        console.warn("没有查询到数据")
    } 
    await connection.release();
    return results
}

module.exports = tingnewsResponse