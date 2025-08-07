import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  applyLink: string | null;
  applyOptions?: {
    publisher: string;
    apply_link: string;
  }[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/file/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // console.log('Extracted skills:', data.skills);
      if (data.skills) {
        setExtractedSkills(data.skills);
        try {
          const skillsQuery = data.skills.join(',');
          const jobsResponse = await fetch(`http://localhost:5000/api/job/getjobs?skills=${skillsQuery}`);
          const jobsData = await jobsResponse.json();
          console.log('Matched jobs:', jobsData.jobs);
          setMatchedJobs(jobsData.jobs || []);
        } catch (jobError) {
          console.error('Error fetching jobs:', jobError);
          setMatchedJobs([]);
        }
      } else {
        setExtractedSkills([]);
      }
    } catch (error) {
      console.error('Resume analysis failed:', error);
      setExtractedSkills([]);
    }

    setIsAnalyzing(false);
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setIsAnalyzing(true);

      // Simulate AI analysis
      // setTimeout(() => {
      //   setExtractedSkills(mockSkills);
      //   setMatchedJobs(mockJobs);
      //   setIsAnalyzing(false);
      // }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Sidebar />

      <div className="ml-64 p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-400">Ready to find your dream job?</p>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-blue-500/30"
              />
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Upload Your Resume</h2>

            <div
              className="border-2 border-dashed border-blue-500/30 rounded-2xl p-12 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isAnalyzing ? (
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-white font-medium">Analyzing your resume with AI...</p>
                  <p className="text-gray-400 text-sm">This may take a few moments</p>
                </motion.div>
              ) : uploadedFile ? (
                <motion.div
                  className="flex flex-col items-center gap-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-gray-400 text-sm">Resume uploaded successfully</p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <CloudArrowUpIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Drop your resume here</p>
                    <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all duration-200"
                    >
                      <CloudArrowUpIcon className="w-5 h-5" />
                      Choose File
                    </label>
                  </div>
                  <p className="text-gray-500 text-xs">Supports PDF files up to 10MB</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Skills Section */}
        {extractedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Extracted Skills</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {extractedSkills.map((skill, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium hover:bg-blue-500/30 transition-all duration-200"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Jobs Section */}
        {matchedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Matched Jobs</h2>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {matchedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <BuildingOfficeIcon className="w-4 h-4" />
                          {job.company}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <BriefcaseIcon className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <CurrencyDollarIcon className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-400 text-xs mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-md text-blue-300 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {Array.isArray(job.applyOptions) && job.applyOptions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {job.applyOptions.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.open(option.apply_link, '_blank')}
                            className="w-full text-sm text-blue-300 underline hover:text-blue-400 transition"
                          >
                            Apply via {option.publisher}
                          </button>
                        ))}
                      </div>
                    )}


                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;