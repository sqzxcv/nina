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

router.get('/api/news_v1', async(ctx, next) => {

    var startid = ctx.query.maxid
    var pagecount = 10
    var catalogid = ctx.query.catalogid
    if (startid === undefined) {
        startid = 0
    }
    try {
        var res = await tingnewsRes_v1(catalogid, startid - 1, pagecount);
        ctx.body = JSON.stringify(res.results)
    } catch (error) {
        console.error(error)
    }
})

router.get('/news_v1', async(ctx, next) => {
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

router.get('/api/news_wx', async(ctx, next) => {

    var startid = ctx.query.maxid
    var pagecount = 10
    var catalogid = ctx.query.catalogid
    if (startid === undefined) {
        startid = 0
    }
    try {
        var res = await tingnewsRes_v1(catalogid, startid - 1, pagecount);
        var mp3list = []
        var catalogs = [{
                catalogid: 1,
                catalog_name: "科技数码"
            },
            {
                catalogid: 2,
                catalog_name: "金融股票"
            },
            {
                catalogid: 3,
                catalog_name: "娱乐体育"
            },
            {
                catalogid: 4,
                catalog_name: "社会军事"
            }
        ]
        for (var index = 0; index < res.results.length; index++) {
            var audioinfo = res.results[index];
            var mp3 = {}
            mp3.title = audioinfo.title
            mp3.image = "http://image.leting.io/" + audioinfo.image
            mp3.src = "http://audio.leting.io/" + audioinfo.audio
            mp3.catalog_name = audioinfo.catalog_name
            mp3.audioid = audioinfo.doc_id
            mp3list.push(mp3)
        }
        var results = {
            "status": 200,
            "message": "ok",
            "results": mp3list,
            "catalogs": catalogs
        }
        ctx.body = JSON.stringify(results)
    } catch (error) {
        console.error(error)
    }
})

/**
 * 返回客户端的结果包括
 * 1=科技数码:科技 + 数码 + 汽车
 * 2=金融股票:产经 + 房产 + 股票 + 金融
 * 3=娱乐体育:娱乐 + 体育 + 脱口秀
 * 4=社会军事:社会+军事:国内 + 国际 + 军事 + 社会
 */
router.get('/api/catalog_wx', async(ctx, next) => {

    var startid = 0
    var pagecount = 10
    var catalogs = [{
            catalogid: 1,
            catalog_name: "科技数码"
        },
        {
            catalogid: 2,
            catalog_name: "金融股票"
        },
        {
            catalogid: 3,
            catalog_name: "娱乐体育"
        },
        {
            catalogid: 4,
            catalog_name: "社会军事"
        }
    ]
    try {
        for (var index = 0; index < catalogs.length; index++) {
            var catalog = catalogs[index];
            var res = await tingnewsRes_v1(catalog.catalogid, startid - 1, pagecount);
            var mp3list = []
            for (var index = 0; index < res.results.length; index++) {
                var audioinfo = res.results[index];
                var mp3 = {}
                mp3.title = audioinfo.title
                mp3.image = "http://image.leting.io/" + audioinfo.image
                mp3.src = "http://audio.leting.io/" + audioinfo.audio
                mp3.catalog_name = audioinfo.catalog_name
                mp3.audioid = audioinfo.doc_id
                mp3list.push(mp3)
            }
            catalogs[index].results = mp3list
        }
        var results = {
            "status": 200,
            "message": "ok",
            "catalogs": catalogs
        }
        ctx.body = JSON.stringify(results)
    } catch (error) {
        console.error(error)
    }
})

module.exports = router