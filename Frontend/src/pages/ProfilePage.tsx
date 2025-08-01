import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarIcon,
  BriefcaseIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';

interface ResumeEntry {
  id: string;
  name: string;
  uploadDate: string;
  jobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    skills: string[];
  }[];
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [expandedResume, setExpandedResume] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const mockResumeHistory: ResumeEntry[] = [
    {
      id: '1',
      name: 'Senior_Developer_Resume_2025.pdf',
      uploadDate: '2025-01-15',
      jobs: [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          skills: ['React', 'TypeScript', 'GraphQL']
        },
        {
          id: '2',
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          skills: ['Node.js', 'React', 'MongoDB']
        }
      ]
    },
    {
      id: '2',
      name: 'Frontend_Developer_Resume.pdf',
      uploadDate: '2025-01-10',
      jobs: [
        {
          id: '3',
          title: 'Frontend Developer',
          company: 'WebFlow Inc.',
          location: 'New York, NY',
          skills: ['React', 'CSS', 'JavaScript']
        }
      ]
    }
  ];

  const toggleResumeExpansion = (resumeId: string) => {
    setExpandedResume(expandedResume === resumeId ? null : resumeId);
  };

  const openJobModal = (job: any) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
  };

  const handleReAnalyze = (resumeId: string) => {
    // Simulate re-analysis
    console.log('Re-analyzing resume:', resumeId);
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
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and resume history</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-500/30"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Member since Jan 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    {mockResumeHistory.length} resumes uploaded
                  </div>
                </div>
              </div>
              
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Profile
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Resume Upload History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Resume Upload History</h2>
          </div>
          
          <div className="space-y-4">
            {mockResumeHistory.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <GlassCard className="overflow-hidden">
                  {/* Resume Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleResumeExpansion(resume.id)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
                        >
                          {expandedResume === resume.id ? (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white">{resume.name}</h3>
                          <p className="text-gray-400 text-sm">
                            Uploaded on {new Date(resume.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm">
                          {resume.jobs.length} jobs matched
                        </span>
                        <motion.button
                          onClick={() => handleReAnalyze(resume.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                          Re-analyze
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable Job List */}
                  {expandedResume === resume.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10 bg-white/5"
                    >
                      <div className="p-6">
                        <h4 className="text-white font-medium mb-4">Matched Jobs:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {resume.jobs.map((job) => (
                            <motion.div
                              key={job.id}
                              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                              onClick={() => openJobModal(job)}
                              whileHover={{ scale: 1.02 }}
                            >
                              <h5 className="text-white font-medium mb-2">{job.title}</h5>
                              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                <BuildingOfficeIcon className="w-4 h-4" />
                                {job.company}
                              </div>
                              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                <MapPinIcon className="w-4 h-4" />
                                {job.location}
                              </div>
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
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeJobModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-8" hover={false}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center gap-2 text-gray-400">
                    <BuildingOfficeIcon className="w-5 h-5" />
                    {selectedJob.company}
                  </div>
                </div>
                <button
                  onClick={closeJobModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <span className="text-gray-400 text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPinIcon className="w-5 h-5" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <BriefcaseIcon className="w-5 h-5" />
                  Full-time
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <motion.button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.button>
                <motion.button
                  onClick={closeJobModal}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;