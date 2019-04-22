const Router = require('koa-router')
const router = new Router({
	prefix:
})
const mongoose = require('mongoose')
router.get('/singer/detail/:id',async (ctx, next) => {
  const id = ctx.params.id
  const song = mongoose.model('song')
  const songs = await singerList.find({
  	singerID: id
  })
  ctx.body = {
    songs
  }
})
module.exports = router
