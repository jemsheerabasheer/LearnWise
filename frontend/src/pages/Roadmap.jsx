import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, CheckCircle, BookOpen, Clock, Target, Bookmark, LayoutDashboard, RefreshCw } from 'lucide-react';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('We are analyzing your profile and generating a personalized learning roadmap just for you...');

  // Basic local state for interactive UI
  const [completedTopics, setCompletedTopics] = useState([]);

  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Try to get existing roadmap
      const response = await axios.get('http://localhost:5000/api/roadmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 2. If 404, we need to generate one
        generateRoadmap();
      } else if (err.response && err.response.status === 400) {
        // 3. User probably hasn't completed input collection
        navigate('/input');
      } else {
        setError('Failed to fetch your roadmap. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async (isRegenerate = false) => {
    if (isRegenerate) {
      const confirmed = window.confirm(
        'Are you sure you want to regenerate your roadmap? ' +
        'Your current roadmap and progress will be replaced with a brand new path.'
      );
      if (!confirmed) return;
      setLoadingMessage('Regenerating your roadmap... This may take 1-2 minutes');
    } else {
      setLoadingMessage('We are analyzing your profile and generating a personalized learning roadmap just for you...');
    }

    setIsLoading(true);
    setRoadmap(null);
    setError('');
    setCompletedTopics([]);

    try {
      const response = await axios.post('http://localhost:5000/api/roadmap/generate', { regenerate: isRegenerate }, {
        timeout: 180000,
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      if (!data || !data.topics || !data.sequences || !data.resources || !data.projects) {
        setError('Roadmap generation failed. Please try again.');
        setRoadmap(null);
      } else if (
        data.topics.length === 0 ||
        data.sequences.length === 0 ||
        data.resources.length === 0 ||
        data.projects.length === 0
      ) {
        setError('Roadmap generation failed. Please try again.');
        setRoadmap(null);
      } else {
        setRoadmap(data);
      }
    } catch (err) {
      if (!err.response) {
        setError('AI service unavailable. Please start Ollama and try again.');
      } else {
        setError('Generation failed. Please wait a moment and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (topic) => {
    if (completedTopics.includes(topic)) {
      setCompletedTopics(completedTopics.filter(t => t !== topic));
    } else {
      setCompletedTopics([...completedTopics, topic]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Hang tight!</h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm">
          {loadingMessage}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div className="mx-auto h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Generation Failed</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => generateRoadmap(false)} className="btn-primary w-full flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  const totalTopics = roadmap.topics?.length || 0;
  const progressPercentage = totalTopics > 0
    ? Math.round((completedTopics.length / totalTopics) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {roadmap.isFallback && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-medium text-sm">We generated a basic roadmap. Regenerate for a more detailed version.</span>
            <button onClick={() => generateRoadmap(true)} className="text-xs font-bold underline hover:text-amber-900">
              Regenerate
            </button>
          </div>
        )}

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Target className="h-8 w-8 text-indigo-600" />
              Your Customized Roadmap
            </h1>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Follow this step-by-step path designed specifically for your skill level, known languages, and career goals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => generateRoadmap(true)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
              title="Regenerate from AI"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-semibold text-slate-700">Course Progress</span>
              <span className="text-sm font-bold text-indigo-600">{progressPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {completedTopics.length} of {totalTopics} topics completed
            </p>
          </div>
        </div>

        {/* Four Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Topics Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800">Topics to Master</h3>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-3">
                {roadmap.topics?.map((topic, i) => {
                  const isChecked = completedTopics.includes(topic);
                  return (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleTopic(topic)}>
                      <div className={`mt-0.5 shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                        {isChecked && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className={`text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                        {topic}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Sequences Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-800">Action Plan</h3>
            </div>
            <div className="p-6 flex-1">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {roadmap.sequences?.map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="font-semibold text-sm">{i + 1}</span>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-sm text-slate-600">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-slate-800">Learning Materials</h3>
              </div>
              <button
                onClick={() => navigate('/materials')}
                className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1"
              >
                Topic by Topic &rarr;
              </button>
            </div>
            <div className="p-4 flex-1">
              <div className="grid gap-3">
                {roadmap.resources?.map((res, i) => {
                  const title = typeof res === 'string' ? res : res.title;
                  const desc = typeof res === 'string' ? null : res.description;
                  const type = typeof res === 'string' ? null : res.type;

                  return (
                    <div key={i} className="flex flex-col justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50/50 transition-colors group">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">{title}</p>
                          {type && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 rounded-md">
                              {type}
                            </span>
                          )}
                        </div>
                        <button className="text-slate-400 hover:text-emerald-600 p-1 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" title="Bookmark Resource">
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>
                      {desc && <p className="text-xs text-slate-500 mt-2">{desc}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-purple-500" />
              <h3 className="font-bold text-slate-800">Mini Projects</h3>
            </div>
            <div className="p-4 flex-1">
              <div className="space-y-4">
                {roadmap.projects?.map((proj, i) => {
                  const title = typeof proj === 'string' ? proj : proj.title;
                  const desc = typeof proj === 'string' ? null : proj.description;
                  const skills = typeof proj === 'string' ? null : proj.skills;

                  return (
                    <div key={i} className="relative pl-6 py-2 border-l-2 border-purple-200">
                      <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[7px] top-3 border-2 border-white"></div>
                      <p className="font-bold text-slate-800">{title}</p>
                      {desc && <p className="text-sm text-slate-600 mt-1">{desc}</p>}
                      {skills && skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((s, idx) => (
                            <span key={idx} className="text-[10px] uppercase font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
