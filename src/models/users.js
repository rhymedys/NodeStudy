/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 14:35:24
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 15:00:48
 */

const User = require('../lib/mongo').User

module.exports = {
  /**
   * @description 创建用户
   * @param {*} user
   */
  create (user) {
    return User.create(user).exec()
  }
}
