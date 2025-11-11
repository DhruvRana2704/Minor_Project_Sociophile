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

module.exports=mongoose.model('Like',likeSchema);