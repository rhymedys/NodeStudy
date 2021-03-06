/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 12:42:02
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-23 14:31:30
 */

const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('../package')

/**
 * @description 文件（目录）地址
 * @param {*} dirPath
 * @returns
 */
function pathResolve (dirPath) {
  return path.join(__dirname, dirPath)
}

const app = express()
// 设置模板目录
app.set('views', pathResolve('./views'))
// 设置模版引擎
app.set('view engine', 'ejs')
// 静态资源地址
app.use(express.static(pathResolve('./public')))
// session
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))
// flash 中间件，用来显示通知
app.use(flash())

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, './public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 路由
routes(app)

app.use(function (err, req, res, next) {
  req.flash('error', err.message)
  res.redirect('/posts')
})

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
