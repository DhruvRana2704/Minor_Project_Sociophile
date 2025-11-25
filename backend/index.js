const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schema/userSchema');
const path = require('path');
require('dotenv').config();
const MongoStore = require('connect-mongo');     // ✅ use Mongo session store

const app = express();

// ENV
const mongooseUrl = process.env.mongourl;
const secret = process.env.secret;
const port = process.env.PORT || 5000;

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));

// ------------------------------------
// ✅ 1. Mongoose (NO deprecated options)
// ------------------------------------
mongoose.connect(mongooseUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.log("❌ MongoDB Error:", err));


// ------------------------------------
// ✅ 2. CORS (dynamic for Render + local)
// ------------------------------------
app.use(cors({
  origin: [
    'http://localhost:5173',                 // local dev
    process.env.FRONTEND_URL                // your deployed frontend
  ],
  credentials: true
}));


// ------------------------------------
// Middleware
// ------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


// ------------------------------------
// ✅ 3. Sessions (MongoStore, REQUIRED for Render)
// ------------------------------------
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongooseUrl,
    ttl: 14 * 24 * 60 * 60  // 14 days
  }),
  cookie: {
    secure: false,          // Render free is not HTTPS on backend
    httpOnly: true
  }
}));


// ------------------------------------
// 4. Passport
// ------------------------------------
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());


// ------------------------------------
// 5. Routes
// ------------------------------------
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/users', require('./routes/user'));
app.use('/posts', require('./routes/post'));
app.use('/followers', require('./routes/follower'));
app.use('/likes', require('./routes/like'));
app.use('/interactions', require('./routes/interaction'));


// ------------------------------------
// 6. Start Server (correct for Render)
// ------------------------------------
app.listen(port, '0.0.0.0', () =>
  console.log(`🚀 Server running on port ${port}`)
);
