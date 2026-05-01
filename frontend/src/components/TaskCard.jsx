import { useState } from 'react';
import API from '../api/axios';

const TaskCard = ({ task, userRole, onUpdate, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const statusConfig = {
    todo: { label: 'To Do', bg: 'bg-slate-100', text: 'text-slate-600', icon: '⏳' },
    inprogress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔄' },
    done: { label: 'Done', bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
  };

  const priorityConfig = {
    low: { bg: 'bg-slate-100', text: 'text-slate-500', icon: '🟢' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🟡' },
    high: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' },
  };

  const s = statusConfig[task.status] || statusConfig.todo;
  const p = priorityConfig[task.priority] || priorityConfig.medium;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await API.put('/tasks/' + task._id, { status: newStatus });
      onUpdate(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${isOverdue ? 'border-red-300' : 'border-slate-100'} ${task.status === 'done' ? 'opacity-75' : ''}`}>
      {isOverdue && <div className="bg-red-500 h-1 w-full"></div>}
      {!isOverdue && <div className={`h-1 w-full ${task.status === 'done' ? 'bg-green-400' : task.status === 'inprogress' ? 'bg-blue-400' : 'bg-slate-200'}`}></div>}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className={`font-semibold text-slate-800 leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${p.bg} ${p.text}`}>
            {p.icon} {task.priority}
          </span>
        </div>

        {task.description && <p className="text-sm text-slate-500 mb-3 leading-relaxed">{task.description}</p>}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
            {s.icon} {s.label}
          </span>
          {isOverdue && <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">🚨 Overdue</span>}
        </div>

        {task.dueDate && (
          <p className={`text-xs mb-3 font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
            📅 Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{task.assignedTo.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned to</p>
              <p className="text-xs font-semibold text-slate-700">{task.assignedTo.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="text-sm border border-slate-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium text-slate-700 cursor-pointer"
          >
            <option value="todo">⏳ To Do</option>
            <option value="inprogress">🔄 In Progress</option>
            <option value="done">✅ Done</option>
          </select>
          {userRole === 'admin' && (
            <button onClick={() => onDelete(task._id)} className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all">
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;