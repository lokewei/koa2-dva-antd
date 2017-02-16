import { request } from '../utils'

export async function query(params) {
  return await request('/api/travel/list', {
    method: 'get',
    data: params
  })
}

export async function create(params) {
  return await request('/api/travel/create', {
    method: 'post',
    data: params
  })
}

export async function update(params) {
  return await request('/api/travel/update', {
    method: 'post',
    data: params
  })
}

export async function remove(id) {
  return await request('/api/travel/delete', {
    method: 'post',
    data: { id }
  })
}

export async function changeStatus(params) {
  return await request('/api/travel/changeStatus', {
    method: 'post',
    data: params
  })
}
