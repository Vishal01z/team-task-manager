import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get('/dashboard').then(({ data }) => {
      setData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
          <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    </>
  );

  const myTasks = data?.myTasks;
  const pct = myTasks?.total > 0 ? Math.round((myTasks.done / myTasks.total) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span className="text-indigo-700 text-sm font-bold">Member Account</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              Welcome, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Here are your assigned tasks and progress.</p>
          </div>

          {/* My Task Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'My Tasks', value: myTasks?.total ?? 0, icon: '📋', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'To Do', value: myTasks?.todo ?? 0, icon: '⏳', color: 'text-slate-600', bg: 'bg-slate-50' },
              { label: 'In Progress', value: myTasks?.inprogress ?? 0, icon: '🔄', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Done', value: myTasks?.done ?? 0, icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{icon}</div>
                <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {myTasks?.total > 0 && (
            <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-800">My Progress</p>
                <span className="text-2xl font-black text-indigo-600">{pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #4f46e5)' }}></div>
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">{myTasks.done} of {myTasks.total} tasks completed</p>
            </div>
          )}

          {/* Notice Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="font-bold text-amber-800 mb-1">Member Permissions</p>
                <ul className="text-sm text-amber-700 space-y-1 font-medium">
                  <li>✅ View all projects you're added to</li>
                  <li>✅ Update status of tasks assigned to you</li>
                  <li>❌ Cannot create or delete tasks</li>
                  <li>❌ Cannot add or remove members</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Overdue */}
          {data?.overdueTasks?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-black text-slate-900 text-lg">🚨 Your Overdue Tasks</h2>
                <span className="bg-red-100 text-red-700 text-xs font-black px-2 py-1 rounded-full">{data.overdueTasks.length}</span>
              </div>
              <div className="space-y-3">
                {data.overdueTasks.filter(t =>
                  t.assignedTo?._id === user?._id || t.assignedTo === user?._id
                ).map(task => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{task.project?.name} • Due {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-red-200 text-red-700">{task.priority}</span>
                  </div>
                ))}
                {data.overdueTasks.filter(t => t.assignedTo?._id === user?._id).length === 0 && (
                  <p className="text-slate-400 text-sm font-medium text-center py-4">🎉 No overdue tasks assigned to you!</p>
                )}
              </div>
            </div>
          )}

          {!myTasks?.total && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No tasks assigned yet</h3>
              <p className="text-slate-500 font-medium">Your admin will assign tasks to you soon.</p>
              <p className="text-slate-400 text-sm mt-2">Go to <strong>Projects</strong> to see which projects you're part of.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;