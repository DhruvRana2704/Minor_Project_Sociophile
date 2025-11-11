const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://randomuser.me/api/portraits/men/32.jpg'
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    bio:{
        type: String,
        default: '',
    },
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);