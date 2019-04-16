const getSingerList = require('../api/getSingerList')
const normSingerList = require('../utils/normSingerList')
;(async () => {
  singerList = await getSingerList()
  result = normSingerList(singerList)
  process.send({result})
  process.exit(0)
})()

