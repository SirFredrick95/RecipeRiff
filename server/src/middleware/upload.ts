import multer from 'multer';
import path from 'path';

const ALLOWED_MIMES: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const ALLOWED_EXTS: string[] = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/cook-logs'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${req.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext) && ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp, heic) are allowed'));
    }
  },
});

export default upload;
