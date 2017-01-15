import { request } from '../utils'

export async function login(params) {
  return await request('/api/login', {
    method: 'post',
    data: params
  })
}

export async function logout(params) {
  return await request('/api/logout', {
    method: 'post',
    data: params
  })
}

export async function userInfo(params) {
  return await request('/api/userInfo', {
    method: 'get',
    data: params
  })
}
