const {getSingerList,getAllSingersDetail} = require('../api/getSingerData')
const normSingerList = require('../utils/normSingerList')
const nomalizeAllSongs = require('../utils/normSongList')
;(async () => {
  let result =[]  
  let singerList = await getSingerList()   //获取歌手列表数据
  let singer_list = normSingerList(singerList)	// 数据规范化
  result.push(singer_list)	//添加到容器
  let itemList = await getAllSingersDetail() //获取歌手详情
  let song_list = nomalizeAllSongs(itemList)	// 对歌曲数据规范化
  result.push(song_list)	//添加到容器
  process.send({result})	//发送到主进程，进程间通信
  process.exit(0)
})()

