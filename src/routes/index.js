/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:15:32
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-15 15:19:15
 */

const routes = [
  {
    path: '/signup',
    cbs: [
      require('./signup')
    ]
  },
  {
    path: '/signin',
    cbs: [
      require('./signin')
    ]
  },
  {
    path: '/signout',
    cbs: [
      require('./signout')
    ]
  },
  {
    path: '/posts',
    cbs: [
      require('./posts')
    ]
  },
  {
    path: '/comments',
    cbs: [
      require('./comments')
    ]
  }
]

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.redirect('posts')
  })

  routes.forEach(val => {
    app.use(val.path, ...val.cbs)
  })
}
