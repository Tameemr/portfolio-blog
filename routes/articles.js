const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// open blank new article router
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('articles/new', { article: new Article() })
})

// Edit functionality for the  article router
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})


// show (view) article router USER
router.get('/1/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/blog/articless_user')     
  res.render('articles/show_user', { article: article })
})


// show (view) article router Admin
router.get('/:slug', ensureAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/blog/articless')     
  res.render('articles/show', { article: article })
})


// save and publish a new article router
router.post('/', ensureAuthenticated, async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

// save and update edited article  
router.put('/:id', ensureAuthenticated, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

// delete article router
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/blog/articles')
})

// saving the article and then redirect to show the article page
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router