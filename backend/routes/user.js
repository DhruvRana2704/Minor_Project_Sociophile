const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../schema/userSchema'); // your Mongoose model
const upload = require('./multer')
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
router.post('/register', async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const userData = { fullName, username, email };

  try {
    const registeredUser = await User.register(userData, password);
    // Automatically log the user in after registration
    req.login(registeredUser, err => {
      if (err) throw err;
      res.json({ success: true, redirectUrl: '/home', user: registeredUser });
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
      res.json({ success: true, message: 'Login successful', redirectUrl: '/home', user });
    });
  })(req, res, next);
});

/**
 * POST /users/logout
 */
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ success: true, message: 'Logged out0' });
  });
});
router.post('/update', isLoggedIn, upload.single('avatar'), async (req, res) => {
  try {
    console.log('Received update request with body:', req.body);
    console.log('Current passport session:', req.session?.passport);

    // Build updates
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.file) updates.avatar = `/uploads/${req.file.filename}`;

    // Determine current user id
    let userId = req.user?._id;
    if (!userId && req.session?.passport?.user) {
      // session stores the username or id depending on your serializeUser
      const currentUser = await User.findOne({ username: req.session.passport.user });
      userId = currentUser?._id;
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
