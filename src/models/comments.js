/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-18 16:14:44
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 17:00:28
 */

const Comment = require('../lib/mongo').Comment
const marked = require('marked')

// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  create (comment) {
    return Comment
      .create(comment)
      .exec()
  },

  /**
   * 通过评论Id 删除评论
   *
   * @param {*} commentId 评论Id
   */
  getCommentById (commentId) {
    return Comment
      .findOne({_id: commentId})
      .exec()
  },

  /**
   * 通过评论Id删除评论
   *
   * @param {*} commentId 评论Id
   * @returns
   */
  delectCommentById (commentId) {
    return Comment
      .deleteOne({_id: commentId})
      .exec()
  },

  /**
   * 通过文章Id删除多条评论
   *
   * @param {*} postId  文章Id
   */
  delectCommentsByPostId (postId) {
    return Comment
      .deleteMany({postId})
      .exec()
  },

  /**
   *通过文章Id 删除文章
   *
   * @param {*} postId 文章Id
   */
  getCommentByPostId (postId) {
    return Comment
      .find({postId})
      .populate({path: 'author', model: 'user'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  /**
   *  通过文章 id 获取该文章下留言数
   *
   * @param {*} postId 文章Id
   */
  getCommentsCount (postId) {
    return Comment
      .estimatedDocumentCount({postId})
      .exec()
  }
}
