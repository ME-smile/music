const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const singerList = mongoose.model('singerList')
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
  child.on('message', data => {
    let singers = data.result
    singers.forEach(group => {
      group.items.forEach(async item => {
        try{
          let singer = await singerList.findOne({
            id : item.id
          })
          if (!singer) {
            singer = new singerList(item)
              singer.save()
          }
        } catch (err) {
          console.log(err)
       }
      })
    })
  })
})()
