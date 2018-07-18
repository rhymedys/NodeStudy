/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-18 10:39:27
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 16:39:14
 */

const Post = require('../lib/mongo').Post
const CommentModal = require('./comments')
const marked = require('marked')

Post.plugin('contentToHtml', {
  afterFind (posts) {
    return posts.map(val => {
      val.content = marked(val.content)
      return val
    })
  }
})

Post.plugin('addCommentsCount', {
  afterFind (posts) {
    return Promise.all(posts.map(val => {
      return CommentModal.getCommentsCount(val._id).then((commentsCount) => {
        val.commentsCount = commentsCount
        return val
      })
    }))
  },
  afterFindOne (post) {
    if (post) {
      return CommentModal
        .getCommentsCount(post.id)
        .then((commentsCount) => {
          post.commentsCount = commentsCount
          return post
        })
    }

    return post
  }
})

module.exports = {

  /**
   * 创建文章
   *
   * @param {*} post 文章
   * @returns
   */
  create (post) {
    return Post.create(post).exec()
  },

  /**
   * 通过文章Id寻找文章
   *
   * @param {*} id 文章Id
   * @returns
   */
  getPostById (id) {
    return Post
      .findOne({_id: id})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  /**
   * 通过Id查找原始文章数据
   *
   * @param {*} id 文章Id
   */
  getRawPostById (id) {
    return Post
      .findOne({_id: id})
      .populate({path: 'author', model: 'User'})
      .exec()
  },

  /**
   * 通过Id修改文章
   *
   * @param {*} id 文章Id
   * @param {*} data 修改数据
   */
  updatePostById (id, data) {
    return Post
      .update({_id: id}, {$set: data})
      .exec()
  },

  /**
   * 通过Id删除文章
   *
   * @param {*} id 文章Id
   * @returns
   */
  deletePostById (id) {
    return Post
      .deleteOne({_id: id})
      .exec()
      .then((res) => {
        if (res.result.ok && res.result.n) {
          return CommentModal.delectCommentsByPostId(id)
        }
      })
  },

  /**
   * 通过作者查找文章
   *
   * @param {*} author 文章作者Id
   * @returns
   */
  getPostByAuthor (author) {
    return Post
      .find({author})
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec()
  },

  /**
   * 通过文章id给pv+1
   *
   * @param {*} id 文章Id
   * @returns
   */
  inPV (id) {
    return Post
      .update({ _id: id }, {$inc: {pv: 1}})
      .exec()
  }

}
