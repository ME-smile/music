class Song {
  constructor({id, mid, singerID, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singerID = singerID
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

function createSong(singerID, musicData) {
  singer = filterSinger(musicData.singer)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singerID: singerID,
    singer: singer,
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songmid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

module.exports = {
  Song,
  createSong
}