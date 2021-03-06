/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 14:21:41
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 16:14:19
 */

const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb, {
  useNewUrlParser: true
})

mongolass.plugin('addCreatedAt', {
  afterFind (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

// 用户模型
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

// 文章模型
exports.Post = mongolass.model('Post', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  pv: {
    type: 'number',
    default: 0
  }
})

exports.Post.index({author: 1, _id: -1}).exec()

// 评论模型
exports.Comment = mongolass.model('Comment', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  postId: {
    type: Mongolass.Types.ObjectId,
    required: true
  }
})

exports.Comment.index({postId: 1, _id: 1}).exec()
