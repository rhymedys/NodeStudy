/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 14:21:41
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 14:53:50
 */

const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb, {
  useNewUrlParser: true
})

exports.User = mongolass.model('User', {
  name: {
    type: 'string',
    require: true
  },
  password: {
    type: 'string',
    require: true
  },
  avatar: {
    type: 'string',
    require: true
  },
  gender: {
    type: 'string',
    emum: ['m', 'f', 'x'],
    default: 'x'
  },
  bio: {
    type: 'string',
    require: true
  }
})

exports.User.index({name: 1}, { unique: true }).exec()
