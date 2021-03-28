const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Portfolio Page
router.get('/', (req, res) => res.render('portfolio'));

// All Articles Page for USER
router.get('/blog/articles_user', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index_user', { articles: articles , user: req.user })
})

// Blog Admin Welcome Page
router.get('/blog/admin',  (req, res) => res.render('welcome'));

// All Articles Page for ADMIN
router.get('/blog/articles', ensureAuthenticated ,async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles , user: req.user })
})



module.exports = router;
