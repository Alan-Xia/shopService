'use strict'

import express from 'express'
import userCtrl from '../controller/user.info'
import statusUser from '../utils/status.user'
let router = express()

export default function (app) {
  // 登录
  router.route('/user/login').post(userCtrl.login)
  // 注册
  router.route('/user/register').post(userCtrl.register)
  // 查询用户列表
  router.route('/user/list').get(userCtrl.getUserList)
  // 修改用户信息
  router.route('/user/update/userInfo').put(userCtrl.updateUserInfo)
  // 获取登录用户权限
  router.route('/user/role').get(userCtrl.getUserRole)
  // 根据id查询用户权限
  router.route('/user/roles/:id').get(userCtrl.queryUserRole)
  // 修改用户权限
  router.route('/user/update/role').put(userCtrl.updateRole)
  // 根据id删除用户
  router.route('/user/delete/:id').delete(userCtrl.deleteUser)
  // 拦截器
  const intercptor = (req, res, next) => {
    if (req.originalUrl === '/api/user/login' || req.originalUrl === '/api/user/register') {
      next()
    } else if (req.session.userInfo && req.session.userInfo.token == req.headers['token']) {
      next()
    } else {
      statusUser.RESULT.data = {
        code: 10000,
        msg: "请登录..."
      }
      res.send(statusUser.RESULT.data)
    }
  }
  app.use(intercptor)
  
  app.use('/api', router)
}