const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose')

router.get('/',async (ctx, next) => {
  const swiperImg = mongoose.model('swiperImg')
  const songList = mongoose.model('songList')
  const img_list = await swiperImg.find({}).sort({
    'meta.createdAt': -1
  })
  const song_list = await songList.find({}).sort({
    'meta.createdAt': -1
  })
  ctx.body = {
    img_list,
    song_list
  }
})
module.exports = router
