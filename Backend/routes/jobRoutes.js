// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/jobController');

router.get('/getjobs', getJobs);

module.exports = router;
