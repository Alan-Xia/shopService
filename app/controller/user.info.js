'use strict'

import logger from '../utils/logger'
import statusUser from '../utils/status.user'
import {users,userRole,roles} from '../services/user.data'
const  routePath = {
  /**
   * @param 用户登录
   */
  login: function (req, res) {
    let {account,password} = req.body
    let userInfo = {}
    let bool = users.find(item => {
      if (item.account == account && item.password == password) {
        userInfo = item
        return true
      } else {
        return false
      }
    })
    if (bool) {
      statusUser.RESULT.data = {
        data: userInfo,
        token: new Date().getTime(),
        success: true,
        status: 200
      }
      req.session.userInfo = statusUser.RESULT.data
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: false,
        msg: '用户名或密码错误',
        status: 201
      }
      res.status(200).send(statusUser.RESULT)
    }
  },
  /**
   * @param 用户注册
   */
  register: function (req, res) {
    logger.info("======> register..." + '<==account==>' +req.body.account + '<==password==>' + req.body.password)
    let bool = false
    let data = req.body
    bool = users.find(o => {
      return o.account == data.account
    })
    if (bool) {
      statusUser.RESULT.data = {
        success: false,
        msg: '用户已存在',
        status: 201
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      const userId = users.map(item => {
        return item.id
      })    
      const maxId = Math.max(...userId)
      data.id = maxId + 1
      // 赋值用户权限
      const roleObj = {}
      roleObj.role_id = data.id
      roleObj.roleName = 'common'
      userRole.push(roleObj)
      // 添加到用户列表
      data.mobile = ""
      data.email = ""
      users.push(data)
      // 返回的数据
      statusUser.RESULT.data = {
        success: true,
        msg: '注册成功'
      }
      res.status(200).json(statusUser.RESULT)
    }
  },
  /**
   * @param 查询用户列表
   */
  getUserList: function (req, res) {
    for(var i=0;i<users.length;i++){
      for(var j=0;j<userRole.length;j++){
          if(users[i].id===userRole[j].role_id){
            users[i].roleName=userRole[j].roleName
            break
          }
      }
    }
    statusUser.RESULT.data = {
      success: true,
      msg: '获取用户列表成功',
      data: users
    }
    res.status(200).json(statusUser.RESULT)
  },
  /**
   * @param 修改用户信息
   */
  updateUserInfo: function (req,res) {
    const data = req.body
    users.forEach((o) => {
      if (o.id == data.id) {
        o.account = data.account;
        o.password = data.password
        o.mobile = data.mobile
        o.email = data.mobile
      }
    })
    let info = users.filter(item => {
      return item.id == data.id
    })
    if (info && info.length > 0) {
      statusUser.RESULT.data = {
        success: true,
        msg: '修改用户信息成功',
        data: [...info]
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: false,
        msg: '修改用户信息失败',
        status: 201
      }
      res.status(401).json(statusUser.RESULT)
    }
  },
  /**
   * @param 获取登录用户权限
   */
  getUserRole: function (req, res) {
    let uid = req.session.userInfo.data.id
    if (uid && uid != null) {
      const result = userRole.filter(item => {
        return item.role_id == uid
      })
      statusUser.RESULT.data = {
        success: true,
        roles: result,
        msg: '获取用户权限成功'
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: false,
        msg: 'id为空',
        status: 201
      }
      res.status(404).json(statusUser.RESULT)
    }
  },
  /**
   * @param 修改用户权限
   */
  updateRole: function (req, res) {
    const data = req.body
    let uid = req.session.userInfo.data.id
    if (data.id == uid) {
      statusUser.RESULT.data = {
        success: false,
        msg: '不能修改登录账号',
        status: 201
      }
      res.status(401).json(statusUser.RESULT)
      return false
    }
    let bool = userRole.filter(item => {
      if (data.id == item.role_id) {
        return item.roleName == 'admin' ? true : false
        // item.roleName = data.roleName
      }
    })
    if (bool) {
      userRole.forEach(item => {
        if (data.id == item.role_id) {
          item.roleName = data.roleName
        }
      })
      statusUser.RESULT.data = {
        success: true,
        msg: '修改权限成功',
        status: 200
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: false,
        msg: '你没有权限修改',
        status: 201
      }
      res.status(400).json(statusUser.RESULT)
    }
  },
  /**
   * @param 根据用户id查询用户权限
   */
  queryUserRole: function (req, res) {
    let uid = req.params.id
    if (uid) {
      const result = userRole.filter(item => {
        return item.role_id == uid
      })
      statusUser.RESULT.data = {
        success: true,
        roles: result,
        msg: '获取用户权限成功'
      }
      res.status(200).json(statusUser.RESULT)
    } else {
      statusUser.RESULT.data = {
        success: false,
        msg: 'id为空',
        status: 201
      }
      res.status(404).json(statusUser.RESULT)
    }
  },
  /**
   * 根据id删除用户
   */
  deleteUser: function (req, res) {
    let id = req.params.id
    let bool = userRole.find(item => {
      if (id == item.role_id) {
        return item.roleName === 'admin' ? true : false
      }
    })
    if (bool) {
      statusUser.RESULT.data = {
        success: false,
        msg: 'admin不可以删除',
        status: 201
      }
      res.status(401).json(statusUser.RESULT)
    } else {
      let flag = userRole.find(item => {
        if (id == item.role_id) {
          return item.roleName === 'admin' ? true : false
        }
      })
      if (flag) {
        users.forEach((item,index) => {
          if (item.id == id) {
            delete users[index]
          }
        })
        userRole.forEach((it,i) => {
          if (it.id == id) {
            delete userRole[i]
          }
        })
        statusUser.RESULT.data = {
          success: true,
          msg: '删除成功',
          status: 200
        }
        res.status(200).json(statusUser.RESULT)
        return
      } else {
        statusUser.RESULT.data = {
          success: false,
          msg: '你没有权限删除',
          status: 201
        }
        res.status(401).json(statusUser.RESULT)
      }
    }
  }

}

export default routePath