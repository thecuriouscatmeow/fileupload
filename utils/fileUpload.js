const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "content")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({
    storage,
    limits: { fileSize: 1000000 * 10 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|png|mp4|gif/;    // Supported file types
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));

        if(mimeType && extname) {
            return cb(null, true);
        }
        cb("Only images supported");
    }
}).single("content");
//single means user can upload only one file at a time

module.exports = upload;