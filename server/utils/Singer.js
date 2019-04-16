// 创建Singer类
class Singer {
  constructor({id, name,title}) {
    this.id = id
    this.name = name
    this.title = title
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
module.exports = Singer