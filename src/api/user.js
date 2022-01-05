import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/user/' + id,
    method: 'get',
    params: { id }
  })
}

export function updateUser(data) {
  return request({
    url: '/user/' + data.userId,
    method: 'put',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        roles: ['admin'],
        name: 'admin',
        avatar: 'https://beyondclouds.oss-cn-beijing.aliyuncs.com/avatar/e4738c08-e928-45fc-a745-babee25062f2.png',
        introduction: '暂无简介'
      }
    })
  })
  /* return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })*/
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
