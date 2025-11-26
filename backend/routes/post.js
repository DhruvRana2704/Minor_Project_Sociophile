const express = require('express');
const expressRouter = express.Router();
const postSchema = require('../schema/postSchema');
const { uploadImage } = require('./multer');


const userSchema = require('../schema/userSchema');
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        message: 'Please login to continue'
    });
};

expressRouter.post('/create_post', uploadImage.single('image'), async (req, res) => {
  try {
    const user = await userSchema.findOne({ username: req.session.passport.user });

    const post = await postSchema.create({
      userId: user._id,
      type: req.body.type,
      url: req.file ? req.file.path : null, // Cloudinary URL
      caption: req.body.caption,
      hashtags: req.body.hashtags
        ? req.body.hashtags.split(',').map(tag => tag.trim())
        : []
    });

    console.log('Post created:', post); 
    res.json({ post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// backend/posts.js
expressRouter.get('/fetchposts', isLoggedIn, async (req, res) => {
    try {
       const posts = await postSchema.aggregate([
  {
    $lookup: {
      from: 'likes',           // your likes collection name
      localField: '_id',       // post._id
      foreignField: 'postId',  // likes.postId
      as: 'likesDocs'
    }
  },
  {
   $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
  },
  {
    $addFields: {
      likesCount: { $size: '$likesDocs' }
    }
  },
  { $sort: { createdAt: -1 } } // sort newest first
])
        res.json({ posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});


expressRouter.get('/fetchlikes', async (req, res) => {
    try {
        const posts = await postSchema.find({ $and: [{ type: 'reel' }, { likes: { $gt: 100 } }] });
        res.render("all_posts.ejs", { posts });
    } catch (error) {
        res.send(error.message);
    }
});

expressRouter.get('/deleteoldpost', async (req, res) => {
    try {
        console.log();
        const posts = await postSchema.findOne({ createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } }); //post less than last 30 minutes
        await postSchema.deleteOne({ createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) } }); //post less last 30 minutes
        res.send(posts);
    } catch (error) {
        res.send(error.message);
    }
});

expressRouter.get('/fetcholdposts', async (req, res) => {
    try {
        console.log();
        const posts = await postSchema.find({ createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) } }); //post from last 30 days
        res.render("all_posts.ejs", { posts });
    } catch (error) {
        res.send(error.message);
    }
});

module.exports = expressRouter;