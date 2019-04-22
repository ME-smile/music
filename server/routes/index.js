const Router = require('koa-router')
const router = new Router()
const mongoose = require('mongoose')

router
  .get('/',async (ctx, next) => {
    const swiperImg = mongoose.model('swiperImg')
    const songList = mongoose.model('songList')
    const img_list = await swiperImg.find({}).sort({
      'meta.createdAt': -1
    }).limit(5)
    const song_list = await songList.find({}).sort({
      'meta.createdAt': -1
    }).limit(6)
    ctx.body = {
      img_list,
      song_list
    }
  })
  .get('/singer',async (ctx, next) => {
    const singerList = mongoose.model('singerList')
    const singer_list = await singerList.find({}).sort({
      'meta.createdAt': -1
    })
    ctx.body = {
      singer_list
    }
  })
  .get('/singer/detail/:id',async (ctx, next) => {
    const id = ctx.params.id
    const song = mongoose.model('song')
    const songs = await song.find({
      'singerID': id
    })
    ctx.body = {
      songs
    }
  })

module.exports = router
