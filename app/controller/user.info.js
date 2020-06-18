'use strict'

import logger from '../utils/logger'
import statusUser from '../utils/status.user'

const users = [
  {
    account: 'alan',
    password: '123456',
    id: 236
  }
]

const  routePath = {
  /**
   * @param 用户登录
   */
  login: function (req, res) {
    let {account,password} = req.body
    logger.info("======> login..." + 'account==>' +account + 'password==>' + password)
    let userInfo = {}
    let bool = false
    users.forEach(item => {
      if (item.account == account && item.password == password) {
        bool = true
        userInfo = item
        return
      } else {
        bool = false
        return
      }
    })
    if (bool) {
      statusUser.RESULT.data = {
        account: userInfo.account,
        id: userInfo.id,
        token: new Date().getTime()
      }
      req.session.userInfo = statusUser.RESULT.data
      res.status(200).json(statusUser.RESULT)
    } else {
      res.status(200).send('用户名或密码错误')
    }
  },
  /**
   * @param 用户注册
   */
  register: function (req, res) {
    logger.info("======> register..." + 'account==>' +req.body.account + 'password==>' + req.body.password)
    let bool = false
    let data = req.body
    bool = users.find(o => {
      return o.account == data.account
    })
    if (bool) {
      statusUser.RESULT.data = {
        success: true,
        msg: '用户已存在'
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      const userId = users.map(item => {
        return item.id
      })    
      const maxId = Math.max(...userId)
      data.id = maxId + 1
      statusUser.RESULT.data = {
        success: true,
        msg: '注册成功'
      }
      users.push(data)
      res.status(200).json(statusUser.RESULT)
    }
  },
  /**
   * @param 查询用户列表
   */
  getUserList: function (req, res) {
    statusUser.RESULT.data = {
      success: true,
      msg: '获取用户列表成功',
      data: users
    }
    res.status(200).json(statusUser.RESULT)
  },

  /**
   * @param 根据id查询用户信息
   */
  queryUserInfo: function (req, res) {
    let bool = false
    const userInfo =  users.filter(item => {
      return item.id == req.query.id
    })
    if (userInfo.length > 0) {
      statusUser.RESULT.data = {
        success: true,
        msg: '获取用户信息成功',
        data: [...userInfo]
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: true,
        msg: '该用户不存在'
      }
    }
  },
  /**
   * @param 修改用户信息
   */
  updateUserInfo: function (req,res) {
    users.forEach((o) => {
      if (o.id == req.body.id) {
        o.title = req.body.title;
        o.publish = req.body.publish;
        o.publishTime = req.body.publishTime;
      }
    })
  }

}

export default routePath
