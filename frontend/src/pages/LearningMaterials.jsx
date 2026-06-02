import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, ArrowLeft, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function LearningMaterials() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [topicMaterials, setTopicMaterials] = useState({});
  const [loadingTopic, setLoadingTopic] = useState(null);
  
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/roadmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopics(response.data.topics || []);
    } catch (err) {
      setError('Failed to fetch topics. Please make sure your roadmap is generated.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTopic = async (topic) => {
    if (expandedTopic === topic) {
      setExpandedTopic(null);
      return;
    }
    
    setExpandedTopic(topic);
    
    // Fetch materials if not already cached in state
    if (!topicMaterials[topic]) {
      setLoadingTopic(topic);
      try {
        const response = await axios.post('http://localhost:5000/api/roadmap/materials', 
          { topic },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTopicMaterials(prev => ({
          ...prev,
          [topic]: response.data.materials
        }));
      } catch (err) {
        console.error('Failed to fetch materials for topic:', topic);
        // Set an error placeholder
        setTopicMaterials(prev => ({
          ...prev,
          [topic]: [{ error: true, title: 'Error loading materials', description: 'Please try again later or check if AI service is running.' }]
        }));
      } finally {
        setLoadingTopic(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Loading your materials...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
           <span className="text-red-500 text-2xl mb-4 block">⚠️</span>
           <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
           <p className="text-slate-600 mb-6">{error}</p>
           <button onClick={() => navigate('/roadmap')} className="btn-primary w-full">Go Back to Roadmap</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => navigate('/roadmap')} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2">
               <ArrowLeft className="h-4 w-4" /> Back to Roadmap
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              Learning Materials
            </h1>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Customized learning materials for each topic based on your specific learning style.
            </p>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.map((topic, index) => {
            const isExpanded = expandedTopic === topic;
            const isLoadingThis = loadingTopic === topic;
            const materials = topicMaterials[topic];

            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
                <button 
                  onClick={() => handleToggleTopic(topic)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-800 text-lg">{topic}</span>
                  <div className="flex items-center gap-3 text-slate-400">
                    {materials && !materials[0]?.error && (
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                        {materials.length} resources
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 space-y-4">
                    {isLoadingThis ? (
                      <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                        <Loader2 className="animate-spin h-5 w-5 text-emerald-600" />
                        <span>Generating custom materials... This may take a moment.</span>
                      </div>
                    ) : materials ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {materials.map((mat, i) => (
                          <div key={i} className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col gap-2 ${mat.error ? 'border-red-200' : 'border-slate-200 hover:border-emerald-500 transition-colors'}`}>
                             <h4 className="font-bold text-slate-800">{mat.title}</h4>
                             <p className="text-sm text-slate-600 flex-1">{mat.description}</p>
                             {mat.link && !mat.error && (
                               <a 
                                 href={mat.link.startsWith('http') ? mat.link : `https://www.google.com/search?q=${encodeURIComponent(mat.link)}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="text-xs font-medium text-emerald-600 flex items-center gap-1 hover:text-emerald-700 mt-2"
                               >
                                 Open Resource <ExternalLink className="h-3 w-3" />
                               </a>
                             )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-slate-500">Failed to load materials.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
