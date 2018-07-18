/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-18 10:39:27
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 15:32:59
 */

const Post = require('../lib/mongo').Post
const marked = require('marked')

Post.plugin('contentToHtml', {
  afterFind (posts) {
    return posts.map(val => {
      val.content = marked(val.content)
      return val
    })
  }
})

module.exports = {

  /**
   * 创建文章
   *
   * @param {*} post
   * @returns
   */
  create (post) {
    return Post.create(post).exec()
  },

  /**
   * 通过文章Id寻找文章
   *
   * @param {*} id
   * @returns
   */
  getPostById (id) {
    return Post
      .findOne({_id: id})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  /**
   * 通过Id查找原始文章数据
   *
   * @param {*} id
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
   * @param {*} id
   * @param {*} data
   */
  updatePostById (id, data) {
    return Post
      .update({_id: id}, {$set: data})
      .exec()
  },

  /**
   * 通过Id删除文章
   *
   * @param {*} id
   * @returns
   */
  deletePostById (id) {
    return Post
      .deleteOne({_id: id})
      .exec()
  },

  /**
   * 通过作者查找文章
   *
   * @param {*} author
   * @returns
   */
  getPostByAuthor (author) {
    return Post
      .find({author})
      .populate({path: 'author', model: 'User'})
      .sort({_id: -1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  /**
   * 通过文章id给pv+1
   *
   * @param {*} id
   * @returns
   */
  inPV (id) {
    return Post
      .update({ _id: id }, {$inc: {pv: 1}})
      .exec()
  }

}
