const router = require('koa-router')()
const Brain = require('../src/brain');
const bluebird = require('bluebird')
const mysql = bluebird.promisifyAll(require('mysql'))
const config = require("../config")
var brain = new Brain();

router.get('/', async(ctx, next) => {

    // brain.fetchTodayNews();
    // brain.monitorWebSite('');
    await ctx.render('index', {
        "title": "畅听吧"
    })
})

router.get('/audio', async(ctx, next) => {
    // ctx.body = 'koa2 string'
    // await ctx.render('nina_h5', {"info":`{}`});
    var pool = mysql.createPool({
        host: config['dbhost'],
        user: config['dbuser'],
        password: config['dbpwd'],
        database: "nina",
        connectionLimit: 100,
        port: "3306",
        waitForConnections: false
    });
    try {
        var connection = await pool.getConnectionAsync();
        var results = await connection.queryAsync(`select * from ugc_document where doc_id=${ctx.query.id}`)
        connection.release()
        if (results.length != 0) {
            await ctx.render('nina_h5', {
                "info": JSON.stringify(results[0]),
                "title": results[0]['title']
            });
        } else {
            console.error("doc_id:" + ctx.query.id + "不存在")
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/json', async(ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

module.exports = router