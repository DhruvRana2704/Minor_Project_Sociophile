const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sociophile_uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, quality: "auto", crop: "limit" }],
  },
});

// For profile avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });


// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sociophile_videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi"],
  },
});

// Export multer uploaders
const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadVideo,uploadAvatar };
