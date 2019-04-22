const {createSong} = require('./Song')
function normalizeSong(singerID, list) {
	let ret = []
	list.forEach((item) => {
		// 对象的结构赋值，取得数据中的musicData对象
		let {musicData} = item
		if (musicData.songid && musicData.albummid) {
					const newSong = createSong(singerID, musicData)
					ret.push(newSong)
			}
		})
	// console.log(ret)
	return ret
}

function nomalizeAllSongs(list) {
  let result = []
  for (let item of list) {
    let ret = normalizeSong(item.singerID, item.musicInfo)
    result.push(ret)
  }
  return result
}
module.exports = nomalizeAllSongs