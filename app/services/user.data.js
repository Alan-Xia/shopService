'use strict'

// 用户信息
const users = [
  {
    account: 'alan',
    password: '123456',
    mobile: '13432114036',
    email: '250585800@qq.com',
    id: 236
  }
]

// 用户权限列表
const userRole = [
  {
    role_id: 236,
    roleName: 'admin' // 管理员
  }
]

const userInfo = []

// 权限列表
const roles = [
  {
    id: 1,
    roleName: 'admin' // 管理员
  },
  {
    id: 2,
    roleName: 'common' // 公共
  },
  {
    id: 3,
    roleName: 'product' // 产品
  },
  {
    id: 4,
    roleName: 'proxies' // 仓管
  }
]

export default {
  users,
  userRole,
  roles
}