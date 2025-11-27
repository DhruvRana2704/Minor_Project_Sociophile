const mongoose=require('mongoose');
const {Schema}=require('mongoose');

const likeSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

// Ensure a user can like a post only once
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports=mongoose.model('Like',likeSchema);