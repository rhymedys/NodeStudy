/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2018-07-15 13:35:01
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2018-07-18 15:46:36
 */

const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const PostModel = require('../models/posts')

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  const author = req.query.author

  PostModel
    .getPostByAuthor(author)
    .then(posts => {
      res.render('posts', {
        posts
      })
    })
    .catch(next)
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author,
    title,
    content
  }

  PostModel.create(post)
    .then((result) => {
      post = result.ops[0]
      req.flash('success', '发表成功')
      res.redirect(`/posts/${post._id}`)
    }).catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  return res.render('create')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId),
    PostModel.inPV(postId)
  ]).then((posts) => {
    const post = posts[0]
    console.log(post)
    if (!post) throw new Error('该文章不存在')

    res.render('post', {
      post: post
    })
  }).catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId
  const authorId = req.session.user._id

  PostModel
    .getRawPostById(postId)
    .then((post) => {
      if (!post) throw new Error('该文章不存在')
      if (authorId.toString() !== post.author._id.toString()) throw new Error('权限不足')

      res.render('edit', {
        post
      })
    }).catch(next)
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  const authorId = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content
  const postId = req.params.postId

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel
    .getRawPostById(postId)
    .then((getRawPostByIdRes) => {
      if (!getRawPostByIdRes) throw new Error('该文章不存在')
      if (authorId.toString() !== getRawPostByIdRes.author._id.toString()) throw new Error('权限不足')

      PostModel
        .updatePostById(postId, {title, content})
        .then((updatePostByIdRes) => {
          req.flash('success', '编辑文章成功')
          // 编辑成功后跳转到上一页
          res.redirect(`/posts/${postId}`)
        })
        .catch(next)
    })
    .catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  const postsId = req.params.postId
  const authorId = req.session.user._id

  PostModel
    .getRawPostById(postsId)
    .then((getRawPostByIdRes) => {
      if (!getRawPostByIdRes) throw new Error('该文章不存在')
      if (authorId.toString() !== getRawPostByIdRes.author._id.toString()) throw new Error('权限不足')

      PostModel
        .deletePostById(postsId)
        .then((deletePostByIdRes) => {
          req.flash('success', '删除文章成功')
          // 删除成功后跳转到主页
          res.redirect('/posts')
        })
        .catch(next)
    })
    .catch(next)
})

module.exports = router
