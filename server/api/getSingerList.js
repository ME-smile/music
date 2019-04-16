const jsonp = require('../utils/jsonp')
const axios = require('axios')
// 获取歌手列表
async function getSingerList () {
  console.log('statrts running...')
  const commonParams = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
  }
  const options = {
    param: 'jsonpCallback',
    prefix: 'jp'
  }
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    page: 'list',
    channel: 'singer',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    format: 'json'
  })
  var res = await axios.get(url, {
    params: data
  })
  return res.data.data.list
}
module.exports = getSingerList