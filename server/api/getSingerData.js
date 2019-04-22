const jsonp = require('../utils/jsonp')
const axios = require('axios')
const {commonParams,options} = require('./config')
// 获取歌手列表
let IDList = []
async function getSingerList () {
  console.log('statrts running...')
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
  let res = await axios.get(url, {
    params: data
  })
  res.data.data.list.forEach((obj) => {
    IDList.push(obj.Fsinger_mid)
  })
  return res.data.data.list
}
async function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId
  })
  let res = await axios.get(url, {
    params: data
  })
  return res.data.data.list
}
async function getAllSingersDetail () {
  let container = []
  for (let i = 0; i < IDList.length ; i++) {
    let obj = {}  
    let id = IDList[i]
    let res = await getSingerDetail(id)
    obj.singerID = id
    obj.musicInfo = res
    container.push(obj)
  }
  return container
}
module.exports = {
  getSingerList,
  getAllSingersDetail
}