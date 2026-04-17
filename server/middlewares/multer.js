import multer from "multer";

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/"); // folder
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;