import { request } from '../utils'

export async function query(params) {
  return await request('/api/contentImgs/query', {
    method: 'get',
    data: params
  })
}

export async function groupList() {
  return await request('/api/contentImgs/groupList', {
    method: 'get'
  })
}
