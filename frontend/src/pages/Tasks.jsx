import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  const [creatingTask, setCreatingTask] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState('');

  const myMembership = project?.members?.find((m) => (m.user._id || m.user)?.toString() === user?._id?.toString());
  const userRole = myMembership?.role || 'member';

  useEffect(() => {
    Promise.all([API.get(`/projects/${projectId}`), API.get(`/tasks/project/${projectId}`)])
      .then(([p, t]) => { setProject(p.data); setTasks(t.data); })
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
  const counts = { all: tasks.length, todo: tasks.filter(t => t.status === 'todo').length, inprogress: tasks.filter(t => t.status === 'inprogress').length, done: tasks.filter(t => t.status === 'done').length };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    setCreatingTask(true);
    try {
      const { data } = await API.post('/tasks', { ...taskForm, project: projectId, assignedTo: taskForm.assignedTo || undefined, dueDate: taskForm.dueDate || undefined });
      setTasks(prev => [data, ...prev]);
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
    } catch (err) { setTaskError(err.response?.data?.message || 'Failed to create task'); }
    finally { setCreatingTask(false); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError('');
    setAddingMember(true);
    try {
      const { data } = await API.post(`/projects/${projectId}/members`, { email: memberEmail, role: memberRole });
      setProject(data); setShowMemberModal(false); setMemberEmail(''); setMemberRole('member');
    } catch (err) { setMemberError(err.response?.data?.message || 'Failed to add member'); }
    finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try { const { data } = await API.delete(`/projects/${projectId}/members/${userId}`); setProject(data); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-5 font-medium transition-colors">
          ← Back to Projects
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project?.name}</h1>
            {project?.description && <p className="text-slate-500 mt-1">{project.description}</p>}
          </div>
          {userRole === 'admin' && (
            <div className="flex gap-2">
              <button onClick={() => setShowMemberModal(true)} className="px-4 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all text-sm">
                + Member
              </button>
              <button onClick={() => setShowTaskModal(true)} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md text-sm">
                + Task
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-1 mb-6 border-b border-slate-200">
          {['tasks', 'members'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 transition-all ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab} {tab === 'tasks' && <span className="ml-1 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'tasks' && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[['all','All','bg-slate-700'],['todo','⏳ Todo','bg-slate-500'],['inprogress','🔄 In Progress','bg-blue-600'],['done','✅ Done','bg-green-600']].map(([f, label, activeColor]) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? `${activeColor} text-white shadow-md` : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {label} <span className="ml-1 opacity-75">({counts[f]})</span>
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <span className="text-5xl">📋</span>
                <p className="text-slate-400 mt-4 mb-6">{filter === 'all' ? 'No tasks yet.' : `No ${filter} tasks.`}</p>
                {userRole === 'admin' && filter === 'all' && (
                  <button onClick={() => setShowTaskModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md">
                    Create first task →
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTasks.map(task => (
                  <TaskCard key={task._id} task={task} userRole={userRole}
                    onUpdate={(updated) => setTasks(prev => prev.map(t => t._id === updated._id ? updated : t))}
                    onDelete={async (id) => { if (!window.confirm('Delete?')) return; await API.delete(`/tasks/${id}`); setTasks(prev => prev.filter(t => t._id !== id)); }} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'members' && (
          <div className="max-w-2xl space-y-3">
            {project?.members?.map(m => (
              <div key={m.user._id || m.user} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-700 font-bold">{m.user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{m.user.name}</p>
                    <p className="text-sm text-slate-500">{m.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {m.role === 'admin' ? '👑 Admin' : '👤 Member'}
                  </span>
                  {userRole === 'admin' && (m.user._id || m.user) !== user?._id && (
                    <button onClick={() => handleRemoveMember(m.user._id || m.user)} className="text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 mb-6">✨ Create Task</h2>
            {taskError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{taskError}</div>}
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                <input type="text" value={taskForm.title} onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))} required placeholder="Task title" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional description" rows={2} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm(p => ({ ...p, assignedTo: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => <option key={m.user._id || m.user} value={m.user._id || m.user}>{m.user.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                  <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowTaskModal(false); setTaskError(''); }} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={creatingTask} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-md">
                  {creatingTask ? '⏳ Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">👥 Add Member</h2>
            {memberError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{memberError}</div>}
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <input type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required placeholder="member@example.com" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <select value={memberRole} onChange={e => setMemberRole(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option value="member">👤 Member</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowMemberModal(false); setMemberError(''); setMemberEmail(''); }} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={addingMember} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-md">
                  {addingMember ? '⏳ Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;