const axios = require('axios');
require('dotenv').config();


const getJobs = async (req, res) => {
  try {
    const skillsParam = req.query.skills;

    if (!skillsParam) {
      return res.status(400).json({ error: 'Skills parameter is required' });
    }

    const skillsArray = skillsParam.split(',').map(skill => skill.trim());
    const query = skillsArray.join(' OR '); // OR-based search

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query,
        num_pages: 1,
        remote_jobs_only: 'true' // Optional: Only show remote jobs
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const jobs = response.data.data.map((job, index) => ({
      id: job.job_id || `${index}`,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country || 'Remote',
      type: job.job_employment_type || 'N/A',
      salary: job.job_min_salary && job.job_max_salary
        ? `$${job.job_min_salary} - $${job.job_max_salary}`
        : 'Not disclosed',
      skills: skillsArray.filter(skill =>
        job.job_description?.toLowerCase().includes(skill.toLowerCase())
      ),
      applyLink: job.job_apply_link || null,
      applyOptions: job.apply_options || [],
    }));

    res.json({ jobs });
  } catch (error) {
    console.error('JSearch API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from JSearch API' });
  }
};

module.exports = { getJobs };


