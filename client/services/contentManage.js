import { request } from '../utils'

export async function query(params) {
  return await request('/api/contentImgs', {
    method: 'get',
    data: params
  })
}
