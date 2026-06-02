import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Settings, Save, Loader2, Sparkles } from 'lucide-react';

export default function AdminModel() {
  const [modelName, setModelName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchModel();
  }, []);

  const fetchModel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/model', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModelName(response.data.model);
    } catch (err) {
      setError('Failed to fetch AI model settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      await axios.put('http://localhost:5000/api/admin/model', { modelName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('AI Model updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update AI model');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 rounded-xl">
           <Settings className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">AI Model Management</h2>
          <p className="text-sm text-slate-500">Configure the local LLaMA engine connected via Ollama.</p>
        </div>
      </div>

      {success && <div className="p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200 flex items-center gap-2"><Sparkles className="h-4 w-4"/> {success}</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Local Ollama Model Name</label>
              <p className="text-xs text-slate-500 mb-4">Ensure this model is installed and running on your local machine via <code className="bg-slate-100 px-1 py-0.5 rounded">ollama run &lt;model&gt;</code> before updating.</p>
              
              <div className="relative">
                 <input 
                   required 
                   type="text" 
                   value={modelName} 
                   onChange={(e) => setModelName(e.target.value)}
                   className="styled-input w-full text-lg pr-24"
                   placeholder="e.g. llama3, mistral, phi3"
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</span>
                 </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving || !modelName.trim()} 
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
}
