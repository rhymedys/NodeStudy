/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:37:48
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 13:52:21
 */
const express = require('express')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModal = require('../models/users')
const sha1 = require('sha1')
const router = express.Router()

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const password = req.fields.password

  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModal.getUserByName(name)
    .then((user) => {
      if (!user) {
        req.flash('error', '用户不存在')
        return
      }

      if (sha1(password) !== user.password) {
        req.flash('error', '密码错误')
        return
      }

      req.flash('success', '成功')
      delete user.password
      req.session.user = user
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router
