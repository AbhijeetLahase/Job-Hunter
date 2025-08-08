const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;
const db = require('../config/db'); // Assuming you have a db config file

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'resume',
        public_id: req.file.originalname.split('.')[0],
        overwrite: true,
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Resume upload failed' });
        }

        const resumeUrl = result.secure_url;

        // Send file to Python ML backend to extract skills
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });

        const mlResponse = await axios.post(
          'http://localhost:8000/extract-skills',
          formData,
          { headers: { ...formData.getHeaders() } }
        );

        const skills = mlResponse.data.skills;

        // Insert into resumes table
        const [resumeInsert] = await db.execute(
          'INSERT INTO resumes (user_id, resume_url) VALUES (?, ?)',
          [req.body.userId || null, resumeUrl]
        );

        const resumeId = resumeInsert.insertId;

        // Insert into job_searches table
        await db.execute(
          'INSERT INTO job_searches (resume_id) VALUES (?)',
          [resumeId]
        );

        res.status(200).json({
          message: 'Resume uploaded & skills extracted successfully',
          resume_url: resumeUrl,
          skills,
        });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Error in handleFileUpload:', error.message);
    res.status(500).json({ error: 'Server error while processing file' });
  }
};

module.exports = {
  handleFileUpload,
};
