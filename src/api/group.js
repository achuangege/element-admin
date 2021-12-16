import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/software/group/',
    method: 'get',
    params: query
  })
}

export function fetchSoftware(id) {
  return request({
    url: '/software/' + id,
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
