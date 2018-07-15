/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:37:48
 * @Last Modified by:   Rhymedys
 * @Last Modified time: 2018-07-15 13:37:48
 */
const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('登录页')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  res.send('登录')
})

module.exports = router
