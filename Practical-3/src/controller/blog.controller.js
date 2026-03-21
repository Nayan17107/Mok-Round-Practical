const mongoose = require('mongoose');
const Blog = require('../model/blog.model');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, category, isPublished } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Title, content, and category are required' });
        }

        if (isPublished !== undefined && typeof isPublished !== 'boolean') {
            return res.status(400).json({ message: 'isPublished must be true or false' });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            authorId: req.user.id,
            isPublished: isPublished ?? false
        });

        return res.status(201).json({ message: 'Blog created', blog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const filter = {
            authorId: req.user.id,
            isDeleted: false
        };

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ count: blogs.length, blogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid blog id' });
        }

        const blog = await Blog.findOne({ _id: id, isDeleted: false });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only author can access this blog' });
        }

        return res.status(200).json({ blog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, isPublished } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid blog id' });
        }

        const updates = {};
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (category !== undefined) updates.category = category;

        if (isPublished !== undefined && typeof isPublished !== 'boolean') {
            return res.status(400).json({ message: 'isPublished must be true or false' });
        }
        if (isPublished !== undefined) {
            updates.isPublished = isPublished;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        const blog = await Blog.findOne({ _id: id, isDeleted: false });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only author can update this blog' });
        }

        Object.assign(blog, updates);
        await blog.save();

        return res.status(200).json({ message: 'Blog updated', blog });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid blog id' });
        }

        const blog = await Blog.findOne({ _id: id, isDeleted: false });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only author can delete this blog' });
        }

        blog.isDeleted = true;
        await blog.save();

        return res.status(200).json({ message: 'Blog deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
