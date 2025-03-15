import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage for images and PDFs
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const generatedFileName = `${Date.now()}-${file.fieldname}${fileExt}`;
        cb(null, generatedFileName);
    }
});

// Define file filter to allow images and PDFs only
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedPdfType = "application/pdf";

    if (file.fieldname === "photo" && allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else if (file.fieldname === "idcard" && file.mimetype === allowedPdfType) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG for photo and PDF for ID card are allowed."), false);
    }
};

// Export Multer upload configuration
export const upload = multer({ 
    storage, 
    fileFilter 
});
