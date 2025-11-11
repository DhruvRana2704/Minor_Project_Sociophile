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


module.exports=router;