import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/projects').then(({ data }) => { setProjects(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const { data } = await API.post('/projects', form);
      setProjects(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Projects</h1>
              <p className="text-slate-500 mt-1 font-medium">{projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold shadow-lg hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-100"></div>)}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="text-7xl mb-4">📁</div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No projects yet</h3>
              <p className="text-slate-500 mb-8 font-medium">Create your first project and start collaborating with your team</p>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold shadow-lg hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                Create First Project →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(project => <ProjectCard key={project._id} project={project} />)}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Create New Project</h2>
              <p className="text-slate-500 text-sm mt-1">You'll become the admin of this project</p>
            </div>
            {error && <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl">{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Website Redesign" className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What is this project about?" rows={3} className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 transition-all bg-slate-50 resize-none font-medium" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setError(''); setForm({ name: '', description: '' }); }} className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 py-3 rounded-2xl font-bold text-white disabled:opacity-60 transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {creating ? '⏳ Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;