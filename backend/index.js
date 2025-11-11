const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schema/userSchema');
const path = require('path');
const app = express();
require('dotenv').config();
const mongooseUrl = process.env.mongourl;
const secret=process.env.secret;
const port = process.env.PORT;
app.use('/uploads', express.static(path.join(__dirname, 'public/images/uploads')));


mongoose.connect(mongooseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(()=>console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// CORS (with credentials)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

// 1️⃣ Session (only once)
app.use(session({
  secret:secret,
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false} // true only over https
}));

// 2️⃣ Passport (only once)
passport.use(new LocalStrategy(User.authenticate())); // or userSchema.createStrategy() if using passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// 3️⃣ Routes
app.get('/', (req,res)=>{
try {
    res.send('index.ejs')

} catch (error) {
  console.log(error)  
}});
app.use('/users', require('./routes/user'));
app.use('/posts', require('./routes/post'));
app.use('/followers', require('./routes/follower'));
app.use('/likes', require('./routes/like'));
app.use('/interactions', require('./routes/interaction'));

app.listen(port,()=>console.log(`Server running on port ${port}`));
