import multer from "multer";
import path from "path";

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profilepics/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

export const upload = multer({ storage, fileFilter });

