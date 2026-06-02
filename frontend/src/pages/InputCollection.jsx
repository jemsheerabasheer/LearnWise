import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Plus, X } from 'lucide-react';

export default function InputCollection() {
  const [currentSkills, setCurrentSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillLevelInput, setSkillLevelInput] = useState('');
  const [preferences, setPreferences] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  
  const [error, setError] = useState('');
  const [skillInlineError, setSkillInlineError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in or if admin
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [token, user, navigate]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    setSkillInlineError('');
    if (!skillInput.trim() || !skillLevelInput) {
      setSkillInlineError('Please enter skill name and select level');
      return;
    }
    const newSkillString = `${skillLevelInput} in ${skillInput.trim()}`;
    if (!currentSkills.some(s => s.toLowerCase() === newSkillString.toLowerCase())) {
      setCurrentSkills([...currentSkills, newSkillString]);
      setSkillInput('');
      setSkillLevelInput('');
    } else {
      setSkillInlineError('Skill already added');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentSkills(currentSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let finalSkills = [...currentSkills];
    if (skillInput.trim() && skillLevelInput) {
      const pendingSkill = `${skillLevelInput} in ${skillInput.trim()}`;
      if (!finalSkills.some(s => s.toLowerCase() === pendingSkill.toLowerCase())) {
        finalSkills.push(pendingSkill);
        setCurrentSkills(finalSkills);
        setSkillInput('');
        setSkillLevelInput('');
      }
    }

    if (!preferences || !careerGoals) {
      setError('Preferred Learning Style and Career Goals are required.');
      return;
    }

    if (careerGoals.length < 3) {
      setError('Career goals must be at least 3 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/user/input',
        {
          currentSkills: finalSkills,
          preferences,
          careerGoals
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Attempt to automatically call POST /api/roadmap/generate here
      try {
        await axios.post(
          'http://localhost:5000/api/roadmap/generate',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (roadmapError) {
        console.warn('Roadmap generation failed or endpoint not implemented yet:', roadmapError.message);
      }

      navigate('/roadmap');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving your details.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center space-x-2 mb-8">
      <div className="h-2 w-16 bg-indigo-600 rounded-full"></div>
      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mesh-pattern py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="w-full max-w-[500px] mb-4 text-center">
         <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Step 1 of 3</p>
         {stepIndicator}
      </div>

      <div className="max-w-[500px] w-full space-y-8 premium-card p-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tell us about yourself</h2>
          <p className="mt-3 text-sm text-slate-500">
            Customize your learning journey by sharing your current skills and goals.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            
            {/* Current Skills Section */}
            <div>
              <label htmlFor="skill-input" className="block text-sm font-medium text-slate-700 ml-1 mb-1">
                Your Current Skills
              </label>
              
              <div className="flex gap-2">
                 <input
                   id="skill-input"
                   type="text"
                   className="styled-input flex-1"
                   placeholder="e.g., Python, Drawing, Communication..."
                   value={skillInput}
                   onChange={(e) => setSkillInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                       e.preventDefault();
                       handleAddSkill(e);
                     }
                   }}
                 />
                 <select
                   className="styled-input w-36"
                   value={skillLevelInput}
                   onChange={(e) => setSkillLevelInput(e.target.value)}
                 >
                   <option value="" disabled>Select level</option>
                   <option value="beginner">Beginner</option>
                   <option value="intermediate">Intermediate</option>
                   <option value="advanced">Advanced</option>
                 </select>
                 <button 
                   type="button" 
                   onClick={handleAddSkill}
                   className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                 >
                   <Plus className="h-5 w-5" />
                 </button>
              </div>
              {skillInlineError && (
                <p className="text-xs text-red-500 mt-1 ml-1">{skillInlineError}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-3">
                {currentSkills.length === 0 && (
                  <p className="text-sm text-slate-500 mt-2 ml-1 italic">Optional - leave empty if you are a complete beginner</p>
                )}
                {currentSkills.map((item, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium rounded-lg capitalize"
                  >
                    {item}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(item)}
                      className="ml-1.5 text-indigo-400 hover:text-indigo-600 outline-none"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Learning Preferences */}
            <div>
              <label htmlFor="preferences" className="block text-sm font-medium text-slate-700 ml-1 mb-1">
                Preferred Learning Style
              </label>
              <select
                id="preferences"
                required
                className="styled-input"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              >
                <option value="" disabled>Select a style</option>
                <option value="videos">Videos</option>
                <option value="articles">Articles</option>
                <option value="projects">Projects</option>
              </select>
            </div>

            {/* Career Goals */}
            <div>
              <label htmlFor="career-goals" className="block text-sm font-medium text-slate-700 ml-1 mb-1">
                Career Goals
              </label>
              <input
                id="career-goals"
                type="text"
                required
                minLength={3}
                className="styled-input"
                placeholder="e.g., Doctor, Lawyer, Web Developer, Graphic Designer, Data Scientist..."
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Save Profile & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
