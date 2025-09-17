import multer from 'multer';
import { BadRequestError } from '../errors/bad-request.error';

const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only image files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

const uploadProductImages = multer().fields([
  { name: "mainImage", maxCount: 1 },
  { name: "extraImages", maxCount: 2 },
]);

const blogUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024  
  }
});

export const uploadBlogImages = blogUpload.single('blogImage');
export { uploadProductImages };

const uploadPersonImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
}).single('image');

export { uploadPersonImage };