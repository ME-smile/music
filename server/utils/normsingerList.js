const Singer = require('./Singer')
function _normalizeSinger(list) {
  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  let mapData = {
    hot: {
      title: HOT_NAME,
      items: []
    }
  }
  // 遍历list,取出前十条，添加到items,
  list.forEach((item, index) => {
    if (index < HOT_SINGER_LEN) {
      mapData.hot.items.push(new Singer({
        id: item.Fsinger_mid,
        name: item.Fsinger_name,
        title: HOT_NAME
      }))
    }
    const key = item.Findex
     // 字母对象，以字母为键
    if (!mapData[key]) {
        mapData[key] = {
          title: key,
          items: []
        }
      }
    // 按字母将歌手分类
    mapData[key].items.push(new Singer({
      id: item.Fsinger_mid,
      name: item.Fsinger_name,
      title: key
      }))
    })
    let hot = []
    let ret = []
    for (let key in mapData) {
      let val = mapData[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }

module.exports= _normalizeSinger