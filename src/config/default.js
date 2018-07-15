/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:23:06
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 13:23:44
 */
module.exports = {
  port: 3000,
  session: {
    secret: 'nodeStudy',
    key: 'nodeStudy',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/nodeStudy'
}
