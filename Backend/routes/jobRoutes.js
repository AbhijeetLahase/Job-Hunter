const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your actual Adzuna credentials
const APP_ID = '58f0704b';
const APP_KEY = '37128b742aa05201a744489d82837de3';

router.get('/getjobs', async (req, res) => {
  const skills = req.query.skills; // e.g. "python,react,node"
  if (!skills) {
    return res.status(400).json({ error: 'No skills provided' });
  }

  const query = skills.split(',').join(' '); // e.g. "python react node"

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${query}`;
    const response = await axios.get(url);

    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      type: job.contract_time || 'N/A',
      salary: job.salary_min && job.salary_max
        ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`
        : 'Not disclosed',
      skills: skills.split(','),
    }));
    console.log('Fetched jobs:', jobs);
    res.json({ jobs });
  } catch (err) {
    console.error('Job API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
