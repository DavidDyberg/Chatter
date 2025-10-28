import multer from "multer";
const storage = multer.memoryStorage();

const MAX_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/heic",
      "image/heif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG, WebP, SVG, and HEIC are allowed."
        )
      );
    }
  },
});
