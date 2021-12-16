import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/software/page',
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

export function updateDeviceSoftware(data) {
  return request({
    url: '/device/' + data.deviceId + '/software/' + data.softId,
    method: 'put',
    data
  })
}
