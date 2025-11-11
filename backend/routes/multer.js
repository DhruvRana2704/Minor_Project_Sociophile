const multer=require('multer');
const {v4:uuidv4}=require('uuid');
const path=require('path');
// Set up storage engine
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/uploads');
    },
    filename:function(req,file,cb){
        const uniqueSuffix=uuidv4()+path.extname(file.originalname);
        cb(null,uniqueSuffix);
    }
});
const upload=multer({storage:storage});
module.exports=upload;