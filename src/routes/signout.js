/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:38:45
 * @Last Modified by:   Rhymedys
 * @Last Modified time: 2018-07-15 13:38:45
 */

const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  res.send('登出')
})

module.exports = router
