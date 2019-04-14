const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const swiperImg = mongoose.model('swiperImg')
const songList = mongoose.model('songList')
;(async () => {
	const script = resolve(__dirname, '../spider/banner')
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
		let imgs = data.result[0]
		let songs = data.result[1]
		console.log('writing into database...')
		imgs.forEach(async item => {
			let img = await swiperImg.findOne({
				imgsrc : item.imgsrc
			})

			if (!img) {
				img = new swiperImg(item)
				await img.save()
			}
		})
		songs.forEach(async item => {
			let song = await songList.findOne({
				img_src : item.img_src
			})
			if (!song) {
				song = new songList(item)
				await song.save()
			}
		})
	})
})()
