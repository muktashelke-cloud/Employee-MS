import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = path.join("public", "uploads");

    if (file.fieldname === "image") {
      cb(null, path.join(basePath, "images"));
    } else {
      cb(null, path.join(basePath, "documents"));
    }
  },

  filename: function (req, file, cb) {
    // ⭐ unique filename
    let fileName;

    if (file.fieldname === "image") {
      fileName = "image_" + Date.now() + path.extname(file.originalname);
    } else {
      fileName = "document_" + Date.now() + path.extname(file.originalname);
    }

    cb(null, fileName);

    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
