const express = require('express');
const multer = require('multer');
const { handleFileUpload } = require('../controllers/fileController');

const router = express.Router();

// In-memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle file upload
router.post('/upload', upload.single('resume'), handleFileUpload);

module.exports = router;
