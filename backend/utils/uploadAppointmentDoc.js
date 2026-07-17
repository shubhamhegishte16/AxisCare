import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) {
    cb(null, `appt-doc-${Date.now()}${path.extname(file.originalname)}`);
  },
});
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpg|jpeg|png)|application\/pdf/.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only JPG, PNG, and PDF files are allowed!'));
}
const uploadAppointmentDoc = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});
export default uploadAppointmentDoc;
