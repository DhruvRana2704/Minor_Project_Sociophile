const interactionModel = require('../schema/interactionSchema');
const Post = require('../schema/postSchema');
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
// const interactionModel=require('../schema/interactionSchema');
const router=require('express').Router();

// POST /api/interactions/watch
router.post("/watch", isLoggedIn, async (req, res) => {
  const {postId, watchedSeconds } = req.body;
  const userId = req.user._id;
  try {
  
      let interaction = await interactionModel.findOne({ userId, postId });
      if (!interaction) {
  interaction = new interactionModel({ userId, postId, attentionTime: watchedSeconds });
} else {
  interaction.attentionTime = (interaction.attentionTime || 0) + watchedSeconds;
}
await interaction.save();

    res.json({ message: "Watch time updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });}
});


// ✅ Fetch recommended reels for a user
router.post('/fetchreels',isLoggedIn, async (req, res) => {
  const userId  = req.user._id;

  try {
    // Step 1️⃣: Get user's past interactions
    const interactions = await interactionModel.find({ userId });
    
    const interactedReelIds = interactions.map(i => i.postId.toString());
    // Step 2️⃣: Calculate scores for interacted reels
    const scoredReels = interactions.map(i => {
      const score =
        (0.5 * (i.attentionTime || 0)) +
        (i.liked ? 2 : 0) +
        (i.commented ? 1 : 0);
      return { postId: i.postId, score };
    });

    // Step 3️⃣: Sort by score
    scoredReels.sort((a, b) => b.score - a.score);

    const topReelIds = scoredReels.slice(0, 5).map(r => r.postId);

    // Step 4️⃣: Get some new/unwatched reels to mix in (for freshness)
    const newReels = await Post.aggregate([
      { $match: { type: 'reel', _id: { $nin: interactedReelIds } } },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likesDocs'
        }
      },
      {
        $addFields: {
          likesCount: { $size: '$likesDocs' }
        }
      }
    ]);

    // Step 5️⃣: Get details of top scored reels
    const topReels = await Post.aggregate([
      { $match: { _id: { $in: topReelIds } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likesDocs'
        }
      },
      {
        $addFields: {
          likesCount: { $size: '$likesDocs' }
        }
      }
    ]);

    // Step 6️⃣: Merge recommended + new reels
    const recommended = [...topReels, ...newReels];

    res.json({ recommended });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recommended reels' });
  }
});

module.exports=router;