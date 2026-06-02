import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Loader2, Trash2, Edit2, Plus, Search, Filter } from 'lucide-react';

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', type: 'video', category: '', difficulty: 'beginner', url: '' });

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/resources', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/resource/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Resource updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin/resource', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Resource added successfully');
      }
      setShowModal(false);
      fetchResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/resource/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('Resource deleted successfully');
        fetchResources();
      } catch (err) {
         setError('Failed to delete resource');
      }
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', type: 'video', category: '', difficulty: 'beginner', url: '' });
    setShowModal(true);
  };

  const openEditModal = (res) => {
    setEditingId(res._id);
    setFormData({ title: res.title, type: res.type, category: res.category, difficulty: res.difficulty, url: res.url });
    setShowModal(true);
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? res.type === filterType || res.difficulty === filterType : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Resource Management</h2>
          <p className="text-sm text-slate-500">Add, update, or remove learning materials.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add Resource
        </button>
      </div>

      {success && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">{success}</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          >
            <option value="">All Types</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="course">Course</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin h-6 w-6 text-indigo-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No resources found. Add your first resource.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{res.title}</td>
                    <td className="px-6 py-4 capitalize text-slate-600">{res.type}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{res.category}</span>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600">{res.difficulty}</td>
                    <td className="px-6 py-4 text-slate-500 w-48 truncate max-w-[200px]" title={res.url}>{res.url}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(res)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(res._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" className="styled-input w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="styled-input w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="course">Course</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select className="styled-input w-full" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input required type="text" className="styled-input w-full" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. JavaScript" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
                <input required type="url" className="styled-input w-full" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://" />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</button>
                <button type="submit" className="btn-primary px-6">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
