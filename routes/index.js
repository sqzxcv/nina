const router = require('koa-router')()
const Brain = require('../src/brain');
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
  await ctx.render('nina_h5', {});
})

router.get('/json', async(ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router