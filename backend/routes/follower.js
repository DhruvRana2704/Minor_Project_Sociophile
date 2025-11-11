const express=require('express');
const expressRouter=express.Router();
const followerSchema = require('../schema/followersSchema');

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

expressRouter.post('/create_follower', isLoggedIn,async (req, res) => {
    try {
        console.log(req.body.username);
        const user=await userSchema.findOne({username:req.body.username}).populate('_id');
        
        if(user){
            const follower = await followerSchema.create({
            followerId: req.user._id,
            followingId: user._id
        });
        res.json({ success: true, follower });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

expressRouter.post("/remove_follower",isLoggedIn, async (req, res) => {
    try {
      const followingId=await userSchema.findOne({username:req.body.username}).populate('_id');
      
      if(!followingId){
        return res.json({success:false, message:"User not found"});
      }
      const user = await followerSchema.deleteOne({ followingId: followingId._id, followerId: req.user._id });
      res.json({success:true, user});

    }catch(err){
      res.json({success:false, message: err.message});
    }
});

expressRouter.get('/getfollowers', isLoggedIn, async (req, res) => {
    try {
        const [followers, following] = await Promise.all([
  followerSchema
    .find({ followingId: req.user._id })
    .populate('followerId', 'username avatar')
    .sort({ createdAt: -1 }),
  followerSchema
    .find({ followerId: req.user._id })
    .populate('followingId', 'username avatar')
    .sort({ createdAt: -1 })
]);

res.json({
  success: true,
  followers,
  following,
  followersCount: followers.length,
  followingCount: following.length
});

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

});
module.exports=expressRouter;
