const router = require('koa-router')()
const Brain = require('../src/brain');
const bluebird = require('bluebird')
const mysql = bluebird.promisifyAll(require('mysql'))
const config = require("../config")
const tingnewsRes = require("./responser/tingnews")
const tingnewsRes_v1 = require("./responser/tingnews_v1")
var brain = new Brain();
const sqlStringM = require('sqlstring')

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
        database: "Nina",
        connectionLimit: 100,
        port: "3306",
        waitForConnections: false
    });
    try {
        var connection = await pool.getConnectionAsync();
        var results = await connection.queryAsync(`select url,title, contentHtml,audio from ugc_document where doc_id=${ctx.query.id}`)
        connection.release()
        if (results.length != 0) {
            // results['contentHtml'] = sqlStringM.escapeString(results['contentHtml'])
            await ctx.render('index', {
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

router.get('/news', async(ctx, next) => {
    // http://ting.lila-info.com/news
    var startid = ctx.query.maxid
    var pagecount = 10
    if (startid === undefined) {
        startid = 0
    }
    try {
        var results = await tingnewsRes(startid - 1, pagecount);
        await ctx.render('tingnews', {
            "title": "听天下",
            "results": JSON.stringify(results)
        });

    } catch (error) {
        console.error(error)
    }
})

router.get('/api/news', async(ctx, next) => {

    var startid = ctx.query.maxid
    var pagecount = 10
    if (startid === undefined) {
        startid = 0
    }
    try {
        var results = await tingnewsRes(startid - 1, pagecount);
        ctx.body = JSON.stringify(results)
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/news_v1', async (ctx, next) => {
    
    var startid = ctx.query.maxid
    var pagecount = 10
    var catalogid = ctx.query.catalogid
    if (startid === undefined) {
        startid = 0
    }
    try {
        var res = await tingnewsRes_v1(catalogid,startid - 1, pagecount);
        ctx.body = JSON.stringify(res.results)
    } catch (error) {
        console.error(error)
    }
})

router.get('/news_v1', async (ctx, next) => {
    var startid = ctx.query.maxid
    var pagecount = 10
    var catalogid = ctx.query.catalogid
    if (startid === undefined) {
        startid = 0
    }
    try {
        var res = await tingnewsRes_v1(catalogid, startid - 1, pagecount);
        await ctx.render('v1_tingnews', {
            "title": res.title,
            "results": JSON.stringify(res.results)
        });

    } catch (error) {
        console.error(error)
    }
})

module.exports = router