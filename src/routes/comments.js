/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:37:22
 * @Last Modified by:   Rhymedys
 * @Last Modified time: 2018-07-15 13:37:22
 */
const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  res.send('创建留言')
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  res.send('删除留言')
})

module.exports = router
