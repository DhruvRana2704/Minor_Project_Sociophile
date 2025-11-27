const express=require('express');
const router=express.Router();
const Like=require('../schema/likeSchema');
const Post=require('../schema/postSchema');
const User=require('../schema/userSchema');
const passport = require('passport');

function isLoggedIn(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Please login to access this resource' 
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

router.post('/like', isLoggedIn, async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const existingLike = await Like.findOne({ userId, postId });
        if (existingLike) {
            return res.status(400).json({ success: false, message: 'You have already liked this post' });
        }
        
        const newLike = new Like({ userId, postId });
        await newLike.save();
        res.json({ success: true, message: 'Post liked successfully' });
    } catch (err) {
        console.error('Like error:', err);
        res.status(500).json({ success: false, message: 'Error liking post' });
    }
});


router.delete('/dislike', isLoggedIn, async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const existingLike = await Like.findOne({ userId, postId });
        if (!existingLike) {
            return res.status(400).json({ success: false, message: 'You have not liked this post yet' });
        }
        
        await Like.deleteOne({ userId, postId });
        res.json({ success: true, message: 'Post disliked successfully' });
    } catch (err) {
        console.error('Like error:', err);
        res.status(500).json({ success: false, message: 'Error disliking post' });
    }
});


// POST /likes/toggle  - toggle like/unlike and return liked state and likesCount
router.post('/toggle', isLoggedIn, async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const existing = await Like.findOne({ userId, postId });
    if (existing) {
      await Like.deleteOne({ userId, postId });
      const likesCount = await Like.countDocuments({ postId });
      return res.json({ success: true, liked: false, likesCount });
    }

    try {
      await Like.create({ userId, postId });
    } catch (err) {
      // handle duplicate key race: if a like was created by another concurrent request,
      // consider it as 'liked' and continue to return the authoritative count
      if (err.code && err.code === 11000) {
        // ignore duplicate key error
      } else {
        throw err;
      }
    }

    const likesCount = await Like.countDocuments({ postId });
    return res.json({ success: true, liked: true, likesCount });
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ success: false, message: 'Error toggling like' });
  }
});


module.exports=router;