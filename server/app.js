const Koa = require('koa')
const app = new Koa()
const { resolve } = require('path')
const { connectdb,schemasInit } = require('./database/init')
const router = require('./routes')
const cors = require('koa2-cors')

;(async () => {
  await connectdb()
  schemasInit()
  require('./task/recommend')
  require('./task/singer')
})()

// 解决跨域问题
app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app
  .use(router.routes())
  .use(router.allowedMethods())
module.exports = app

