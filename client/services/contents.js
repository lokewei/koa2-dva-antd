import { request } from '../utils'

export async function query(params) {
  return await request('/api/post/list', {
    method: 'get',
    data: params
  })
}

export async function queryDests() {
  return await request('/api/post/queryDests', {
    method: 'get'
  })
}

export async function create(params) {
  return await request('/api/post/create', {
    method: 'post',
    data: params
  })
}

export async function update(params) {
  return await request('/api/post/update', {
    method: 'post',
    data: params
  })
}

export async function remove(id) {
  return await request('/api/post/delete', {
    method: 'post',
    data: { id }
  })
}

export async function changeStatus(params) {
  return await request('/api/post/changeStatus', {
    method: 'post',
    data: params
  })
}
