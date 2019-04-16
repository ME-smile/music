const puppteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
// 自动执行函数
;(async () => {
	let url = 'https://y.qq.com/m/index.html'
	const browser = await puppteer.launch({	//launch()方法返回一个browser实例
		args: ['--no-sandbox'],
		dumpio: false
	})
	const page = await browser.newPage()
	await page.emulate(iPhone)
	// await page.setViewport({width: 375, height: 667})
	await page.goto(url, {
		waitUntil: 'networkidle2' // 等待网络状态为空闲的时候才继续执行
	})
	await page.waitForSelector('.qui_slider')
	let result = await page.evaluate(() => {
		let data = [] // 声明一个数组存储数据
		// 处理轮播图数据
		let imgItems = document.querySelectorAll('.qui_slider__item')
		let imgList = []
		for (let item of imgItems) {
			let imgsrc = item.querySelector('img').src
			imgList.push({
				imgsrc
			})
		}
		data.push(imgList)
		// 处理歌单数据
		let songItems = document.querySelectorAll('.mod_twocol_list.mod_twocol_list_special>.list_container>li')
		let songList = []
		for (let item of songItems) {
			let img_src = item.querySelector('img').src
			let song_desc = item.querySelector('.list_info>.list_tit').innerText
			let song_type = item.querySelector('.list_info>.list_text').innerText
			songList.push({
				img_src,
				song_desc,
				song_type
			})
		}
		data.push(songList)
		return data
	})
	browser.close()
	process.send({result})
	process.exit(0)
})()