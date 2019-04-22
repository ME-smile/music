const {commonParams,options} = require('./config')
const axios = require('axios')
const mongoose = require('mongoose')
const singer = mongoose.model('singer')
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
  console.log(res.data.data.list)
  return res.data.data.list
}
async function getAllSingersDetail () {
  let singersID = []
  let res = await singer.find({},'id')
  res.forEach((obj) => {
    getSingerDetail(obj.id)
  })
}
module.exports = getAllSingersDetail