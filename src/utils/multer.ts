// utils/multer.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan environment variable ada
const BASE_PATH = process.env.IMAGE_PATH || process.cwd();

// Fungsi untuk membuat konfigurasi multer dengan folder tujuan spesifik
function createUploader(folderType: 'users' | 'merchant' | 'product') {
  // Buat path lengkap untuk folder target
  const uploadDir = path.join(BASE_PATH, `/src/image/${folderType}`);

  // Pastikan direktori upload ada
  if (!fs.existsSync(uploadDir)) {
    console.log(`Membuat direktori upload: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Buat storage untuk folder spesifik
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  // Return konfigurasi multer
  return multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
      // Menerima hanya file gambar
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error("File harus berupa gambar (jpeg, jpg, png, gif)"));
    }
  });
}

const upload = {
    user: createUploader('users'),
    merchant: createUploader('merchant'),
    product: createUploader('product')
  };

export default upload;