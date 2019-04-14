const Koa = require('koa')
const app = new Koa()
const { resolve } = require('path')
const { connectdb,schemasInit } = require('./database/init')
const router = require('./routes')
;(async () => {
  await connectdb()
  schemasInit()
  require('./task/music')
})()

app
  .use(router.routes())
  .use(router.allowedMethods())
module.exports = app