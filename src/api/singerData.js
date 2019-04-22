import axios from 'axios'
export function getSingerData () {
  const url = 'http://localhost:3000/singer'
  return axios.get(url).then(res => Promise.resolve(res.data))
}