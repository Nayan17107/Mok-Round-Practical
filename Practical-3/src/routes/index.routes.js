const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog} = require('../controller/blog.controller');
const { register, login} = require('../controller/auth.controller');
const { verifyToken } = require('../middleware/verifyToken');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Blog routes
router.post('/blog', verifyToken, createBlog);
router.get('/blogs', verifyToken, getBlogs);
router.get('/blogs/:id', verifyToken, getBlogById);
router.put('/blogs/:id', verifyToken, updateBlog);
router.delete('/blogs/:id', verifyToken, deleteBlog);

module.exports = router;
