const mongoose=require('mongoose');
const {Schema}=mongoose;

const followerSchema=new Schema({
    followerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    followingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
});

module.exports=mongoose.model('Followers',followerSchema);