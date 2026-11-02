import multer from 'multer';
import path from 'path';
import crypto from 'node:crypto';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/');
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (error, buffer) => {
      if (error) {
        return cb(error);
      }
      const uniqueSuffix =
        buffer.toString('hex') + path.extname(file.originalname);
      cb(null, uniqueSuffix);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, GIF, SVG, PDF, DOC, DOCX.`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
  fileFilter,
});

export default upload;
