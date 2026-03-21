const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/verifyToken');
const authController = require('../controller/auth.controller');
const blogController = require('../controller/blog.controller');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Blog routes
router.post('/blog', verifyToken, blogController.createBlog);
router.get('/blogs', verifyToken, blogController.getBlogs);
router.get('/blogs/:id', verifyToken, blogController.getBlogById);
router.put('/blogs/:id', verifyToken, blogController.updateBlog);
router.delete('/blogs/:id', verifyToken, blogController.deleteBlog);

module.exports = router;
