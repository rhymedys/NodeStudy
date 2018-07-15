/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:38:22
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 15:44:25
 */
const fs = require('fs')
const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const path = require('path')
const UserModal = require('../models/users')

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.files.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    console.log('创建用户校验错误', e)
    fs.unlink(req.files.avatar.name, () => {

    })
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name,
    password,
    gender,
    bio,
    avatar
  }

  UserModal.create(user)
    .then((result) => {
      user = result.ops[0]
      // 删除密码这种敏感信息，将用户信息存入 session
      delete user.password
      req.session.user = user
      // 写入 flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    }).catch((e) => {
      fs.unlink(req.files.avatar.name, () => {

      })
      if (e.message.match('duplicate key')) {
        req.flash('创建用户失败', '用户名已被占用')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
