import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const StatCard = ({ title, value, color, bg, icon }) => (
  <div className={`${bg} rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
    <p className="text-sm font-medium text-slate-600">{title}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard').then(({ data }) => { setStats(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard 📊</h1>
          <p className="text-slate-500 mt-1">Overview of your team's progress</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Projects" value={stats?.totalProjects ?? 0} color="text-indigo-600" bg="bg-indigo-50" icon="📁" />
          <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} color="text-slate-800" bg="bg-white" icon="📋" />
          <StatCard title="To Do" value={stats?.tasksByStatus?.todo ?? 0} color="text-slate-600" bg="bg-slate-50" icon="⏳" />
          <StatCard title="In Progress" value={stats?.tasksByStatus?.inprogress ?? 0} color="text-blue-600" bg="bg-blue-50" icon="🔄" />
          <StatCard title="Done" value={stats?.tasksByStatus?.done ?? 0} color="text-green-600" bg="bg-green-50" icon="✅" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5 text-lg flex items-center gap-2">👤 My Tasks</h2>
            {stats?.myTasks?.total > 0 ? (
              <div className="space-y-4">
                {[
                  { label: 'To Do', value: stats.myTasks.todo, color: 'bg-slate-400', light: 'bg-slate-100' },
                  { label: 'In Progress', value: stats.myTasks.inprogress, color: 'bg-blue-500', light: 'bg-blue-100' },
                  { label: 'Done', value: stats.myTasks.done, color: 'bg-green-500', light: 'bg-green-100' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                    <div className={`w-full ${item.light} rounded-full h-2.5`}>
                      <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${stats.myTasks.total > 0 ? (item.value / stats.myTasks.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">🎯</span>
                <p className="text-slate-400 mt-2">No tasks assigned to you yet</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">🚨 Overdue Tasks</h2>
              {stats?.overdueTasks?.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                  {stats.overdueTasks.length} overdue
                </span>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats?.overdueTasks?.length > 0 ? stats.overdueTasks.map((task) => (
                <div key={task._id} className="flex items-start justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {task.project?.name} • Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    task.priority === 'high' ? 'bg-red-200 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                  }`}>{task.priority}</span>
                </div>
              )) : (
                <div className="text-center py-8">
                  <span className="text-4xl">🎉</span>
                  <p className="text-slate-400 mt-2">No overdue tasks!</p>
                </div>
              )}
            </div>
          </div>

          {stats?.tasksPerUser?.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
              <h2 className="font-bold text-slate-800 mb-5 text-lg flex items-center gap-2">👥 Team Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="pb-3 text-left text-slate-500 font-semibold">Member</th>
                      <th className="pb-3 text-center text-slate-500 font-semibold">Total</th>
                      <th className="pb-3 text-center text-slate-500 font-semibold">⏳ Todo</th>
                      <th className="pb-3 text-center text-slate-500 font-semibold">🔄 Progress</th>
                      <th className="pb-3 text-center text-slate-500 font-semibold">✅ Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.tasksPerUser.map((entry) => (
                      <tr key={entry.user._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-700 font-bold text-xs">{entry.user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-semibold text-slate-800">{entry.user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center font-bold text-slate-700">{entry.total}</td>
                        <td className="py-3 text-center text-slate-500">{entry.todo}</td>
                        <td className="py-3 text-center text-blue-600 font-medium">{entry.inprogress}</td>
                        <td className="py-3 text-center text-green-600 font-medium">{entry.done}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {!stats?.totalTasks && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 mt-6">
            <span className="text-6xl">🚀</span>
            <p className="text-slate-500 text-lg mt-4 mb-6">No data yet. Create your first project!</p>
            <Link to="/projects" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md">
              Create Project →
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;