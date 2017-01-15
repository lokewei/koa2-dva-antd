import { request } from '../utils'

export async function myCity(params) {
  return await request('http://www.zuimeitianqi.com/zuimei/myCity', {
    method: 'get',
    cross: true,
    data: params
  })
}

export async function queryWeather(params) {
  return await request('http://www.zuimeitianqi.com/zuimei/queryWeather', {
    method: 'get',
    cross: true,
    data: params
  })
}

export async function query(params) {
  return await request('/api/dashboard', {
    method: 'get',
    data: params
  })
}
