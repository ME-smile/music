import jsonp0 from 'jsonp'

export default function jsonp (url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + queryString(data)
  return new Promise((resolve, reject) => {
    jsonp0(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function queryString(data) {
  let params = ''
  for (let [key, value] in data.entries) {
    params += `&${key}=${encodeURIComponent(value)}`
  }
  return params.substring(1) // 去除第一个&
}
