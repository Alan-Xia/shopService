'use strict'

import express from 'express'
import userCtrl from '../controller/user.info'
import statusUser from '../utils/status.user'
let router = express()

export default function (app) {
  router.route('/user/login').post(userCtrl.login)
  router.route('/user/register').post(userCtrl.register)

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