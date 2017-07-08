const router = require('koa-router')()
const Brain = require('../src/brain');
var brain = new Brain();

router.get('/', async (ctx, next) => {

  await ctx.render('index',{"title":"畅听吧"})
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
