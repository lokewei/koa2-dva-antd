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

export async function delImgItem(id) {
  return await request('/api/contentImgs/delImgItem', {
    method: 'post',
    data: { id }
  })
}

export async function delImgItems(ids) {
  return await request('/api/contentImgs/delImgItems', {
    method: 'post',
    data: { ids }
  })
}

export async function createGroup(name) {
  return await request('/api/contentImgs/createGroup', {
    method: 'post',
    data: { name }
  })
}

export async function changeGroup(ids, groupId) {
  return await request('/api/contentImgs/changeGroup', {
    method: 'post',
    data: { ids, groupId }
  })
}

export async function renameGroup(id, name) {
  return await request('/api/contentImgs/renameGroup', {
    method: 'post',
    data: { id, name }
  })
}

export async function deleteGroup(id) {
  return await request('/api/contentImgs/deleteGroup', {
    method: 'post',
    data: { id }
  })
}


