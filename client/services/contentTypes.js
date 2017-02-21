import { request } from '../utils'

export async function query(params) {
  return await request('/api/post/types', {
    method: 'get',
    data: params
  })
}

export async function create(params) {
  return await request('/api/post/types/create', {
    method: 'post',
    data: params
  })
}

export async function update(params) {
  return await request('/api/post/types/update', {
    method: 'post',
    data: params
  })
}

export async function remove(id) {
  return await request('/api/post/types/delete', {
    method: 'post',
    data: { id }
  })
}

export async function changeShowType(params) {
  return await request('/api/post/types/changeShowType', {
    method: 'post',
    data: params
  })
}
