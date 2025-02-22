const path = require("path");
const multer = require("multer");

const uploadDir = path.resolve(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use absolute path
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".webp", ".png", ".mp4"].includes(ext)) {
      return cb(new Error(`Unsupported file type: ${ext}`), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
