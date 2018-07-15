/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 14:35:24
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 21:40:11
 */

const User = require('../lib/mongo').User

module.exports = {
  /**
   * @description 创建用户
   * @param {*} user
   */
  create (user) {
    return User.create(user).exec()
  },

  /**
   * @description 根据用户名查找用户信息
   * @param {*} name
   * @returns
   */
  getUserByName (name) {
    return User.findOne({name}).addCreatedAt().exec()
  }
}
