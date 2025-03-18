const path = require("path");
const multer = require("multer");
const AppError = require("../utils/AppError");

const ALLOWED_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/svg+xml": ".svg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIME_TYPES[file.mimetype];
    if (!ext) {
      return cb(
        new AppError(400, `Invalid file type: ${file.mimetype}`),
        false
      );
    }
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES[file.mimetype]) {
    return cb(
      new AppError(400, `Unsupported file type: ${file.mimetype}`),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
