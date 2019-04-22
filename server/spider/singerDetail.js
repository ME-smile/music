const getAllSingersDetail = require('../api/getSingerDetail')
const normSingerList = require('../utils/normSingerList')
;(async () => {
  let singerList = await getAllSingersDetail()
  console.log(singerList)
  process.send({result})
  process.exit(0)
})()