// seedPosts.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Post = require('./schema/postSchema'); // adjust path if needed

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Urban_Wave', {
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Possible categories or hashtags for reels
const hashtagsList = [
  '#sports', '#music', '#travel', '#food', '#funny', '#fashion',
  '#pets', '#tech', '#dance', '#art', '#fitness', '#gaming'
];

// Generate 100 fake reels
const generateFakeReels = async () => {
  const fakeUserId = new mongoose.Types.ObjectId(); // temp user reference (replace later with real users)
  const reels = [];

  for (let i = 0; i < 100; i++) {
    const caption = faker.lorem.sentence();
    const reel = {
      userId: fakeUserId,
      type: 'reel',
      url: faker.internet.url(), // replace with your own Cloudinary/video URLs later
      caption,
      hashtags: faker.helpers.arrayElements(hashtagsList, 3),
      likes: faker.number.int({ min: 0, max: 1000 }),
      comments: faker.number.int({ min: 0, max: 200 }),
      shares: faker.number.int({ min: 0, max: 100 }),
      views: faker.number.int({ min: 100, max: 5000 }),
      createdAt: faker.date.recent({ days: 30 })
    };
    reels.push(reel);
  }

  await Post.insertMany(reels);
  console.log('🎉 100 Fake Reels Added Successfully!');
  mongoose.connection.close();
};

generateFakeReels();
