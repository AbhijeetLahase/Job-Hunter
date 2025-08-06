const axios = require('axios');

/**
 * Handle in-memory file upload and forward to Python ML backend
 */
const handleFileUpload = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create FormData to send to Python backend
    const FormData = require('form-data');
    const formData = new FormData();
    console.log('Received file:', req.file);
    // Append the file buffer with a filename and correct MIME type
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    console.log('FormData prepared for file upload');
    // Send POST request to Python ML backend

    const response = await axios.post('http://localhost:8000/extract-skills', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Return the result from ML backend
    const skills = response.data.skills;

    res.status(200).json({ skills }); 
  } catch (error) {
    console.error('Error in fileController:', error.message);
    res.status(500).json({ error: 'Server error while processing file' });
  }
};

module.exports = {
  handleFileUpload,
};
