import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'canteen_management/comments',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'limit' }, 
      { quality: 'auto' }, 
      { fetch_format: 'auto' } 
    ]
  }
});
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')){
    return cb(new Error('Chỉ cho phép upload hình ảnh!'), false);
  }
  cb(null, true);
};
const uploadCloud = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});
export default uploadCloud;