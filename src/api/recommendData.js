import axios from 'axios'
export function getRecommendData () {
  const url = 'http://localhost:3000/'
  return axios.get(url).then(res => Promise.resolve(res.data))
}