import uploadCloud from '../configs/cloudinary.config.js';
import { sendError } from '../utils/response.util.js';
const uploadImage = (fieldName) => {
  return (req, res, next) => {
    const upload = uploadCloud.single(fieldName);
    upload(req, res, (err) => {
      if (err) {
        let message = err.message;
        if (err.code === 'LIMIT_FILE_SIZE') {
          message = 'File quá lớn! Tối đa là 5MB.';
        }
        return sendError(res,message,400,err)
      }
      next();
    });
  };
};
export default uploadImage;