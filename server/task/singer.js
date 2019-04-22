const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const singer = mongoose.model('singer')
const singerList = mongoose.model('singerList')
const song = mongoose.model('song')
;(async () => {
  const script = resolve(__dirname, '../spider/singerData')
  // 衍生一个新的 Node.js 进程，并通过建立 IPC 通信通道来调用指定的模块，该通道允许在父进程与子进程之间发送消息。
  const child = cp.fork(script ,[])
  let invoked = false
  child.on('error', err => {
    if (invoked) return
      invoked = true
    console.log(err)
  })
  child.on('exit', code => {
    if (invoked) return
      invoked = false
  })
  child.on('message', async data => {
    // 处理歌手列表数据
    let result0 = data.result[0] // 获取歌手列表数据
    let result1 = data.result[1]  //获取歌手详情数据
    for (let group of result0) {
      let singers = []
      let singer_list = await singerList.findOne({
        title: group.title
      })
      for (let item of group.items) {
        let star = await singer.findOne({
          id: item.id
        })
        if(!star){
          star = new singer(item)
          singers.push(star)
          star.save()
        }
      }
      if(!singer_list){
        singer_list = new singerList({title:group.title,singers})
      }else{
        singer_list.singers.push(...singers)
      }
      singer_list.save()
    }

    // 处理歌手详情数据
    for (let group of result1) {
      for (let item of group) {
        // 判断该歌曲在数据库中是否存在，如果不存在则创建
        let music = await song.findOne({
          id: item.id
        })
        if (!music) {
          music = new song(item)
          music.save()
        }
      }
    }
  })
})()