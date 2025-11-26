const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../schema/userSchema'); // your Mongoose model

const { uploadAvatar } = require('./multer');

// ✅ Middleware to check login
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

/**
 * GET /users/profile   (profile of current logged-in user)
 */
router.get('/profile', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please login to view profile' 
      });
    }

    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

/**
 * GET /users/profile/:username   (profile by username)
 */
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /users/register
 */


router.post('/register', uploadAvatar.single('avatar'), async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const userData = { fullName, username, email };

  // If user uploaded avatar, add its Cloudinary URL
  if (req.file) {
    userData.avatar = req.file.path; // Cloudinary URL
  }

  try {
    const registeredUser = await User.register(userData, password);

    // Automatically log the user in after registration
    req.login(registeredUser, err => {
      if (err) throw err;
      res.json({ success: true, redirectUrl: '/', user: registeredUser });
    });
  } catch (error) {
    if (error.name === 'UserExistsError') {
      res.status(409).json({ error: 'Username already exists' });
    } else if (error.code === 11000) {
      res.status(409).json({ error: 'Email or username already exists' });
    } else {
      res.status(500).json({ error: error.message || 'Registration failed' });
    }
  }
});


/**
 * POST /users/login
 */
router.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    req.logIn(user, err => {
      if (err) return next(err);
      res.json({ success: true, message: 'Login successful', redirectUrl: '/', user });

    });
  })(req, res, next);
});

/**
 * POST /users/logout
 */
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ success: true, message: 'Logged out' });
  });
});

router.post('/update', isLoggedIn, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio) updates.bio = req.body.bio;

    // Use Cloudinary URL
    if (req.file) updates.avatar = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});



router.get('/fetchusers',isLoggedIn,async(req,res)=>{
  try {
    const users = await User.find({})
    res.json({success:'true',users})
  } catch (error) {
    res.status(500).json('Internal server error '+error.message);
  }
});

module.exports = router;
