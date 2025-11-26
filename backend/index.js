const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schema/userSchema');
const path = require('path');
require('dotenv').config();


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
    "http://localhost:5173",
    "https://minor-project-sociophile-1.onrender.com"
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
const MongoStore = require("connect-mongo");

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.mongourl,
    collectionName: "sessions"
  }),
  cookie: (function(){
    const isProd = process.env.NODE_ENV === 'production';
    return {
      // In production (Render) we require Secure + SameSite=None for cross-site cookies.
      // During local development we disable `secure` and use a more permissive SameSite so
      // the session cookie can be set over plain HTTP.
      secure: isProd,
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24
    };
  })()

}));


app.set("trust proxy", 1);


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

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
});
