const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const path = require('path');
const mongoose = require('mongoose');
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route to create a new blog
router.post('/blogs', auth, upload.single('headerImage'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const userId = req.user._id; // Extracted from the token

    if (!title || !content || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newBlog = new Blog({ title, content, image, user: userId });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully!', image: newBlog.image });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Route to get all blogs of the authenticated user
router.get('/user/blogs', auth, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user._id });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Route to get a single blog by ID for editing or deleting (authenticated)
router.get('/user/blogs/:id', auth, async (req, res) => {
    const blogId = req.params.id;
    console.log('Received ID:', blogId);  // Debug statement

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID format.' });
    }

    try {
        const blog = await Blog.findOne({ _id: new mongoose.Types.ObjectId(blogId), user: req.user._id });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// Route to get all blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user', 'username').sort({ createdAt: -1 }); // Sort by createdAt in descending order
        console.log('Fetched blogs:', blogs); // Log the fetched blogs for debugging
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Route to get a single blog by ID (unauthenticated)
router.get('/blogs/:id', async (req, res) => {
    const blogId = req.params.id;
    console.log('Received ID:', blogId);  // Debug statement

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID format.' });
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// Route to update an existing blog by ID (authenticated)
router.put('/user/blogs/:id', auth, upload.single('headerImage'), async (req, res) => {
    const blogId = req.params.id;
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID format.' });
    }

    try {
        let blog = await Blog.findOne({ _id: blogId, user: req.user._id });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        // Update blog fields
        blog.title = title;
        blog.content = content;
        if (image) {
            blog.image = image;
        }

        await blog.save();

        res.json({ message: 'Blog updated successfully!', image: blog.image });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// Route to delete a single blog by ID (authenticated)
router.delete('/user/blogs/:id', auth, async (req, res) => {
    const blogId = req.params.id;
    console.log('Received ID for deletion:', blogId);  // Debug statement

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID format.' });
    }

    try {
        const result = await Blog.deleteOne({ _id: blogId, user: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        console.log('Blog deleted successfully:', blogId);  // Debug statement
        res.json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

module.exports = router;