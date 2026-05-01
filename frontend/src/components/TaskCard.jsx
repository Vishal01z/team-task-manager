import { useState } from 'react';
import API from '../api/axios';

const TaskCard = ({ task, userRole, onUpdate, onDelete }) => {
  const [updating, setUpdating] = useState(false);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const statusMap = {
    todo: { label: 'To Do', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
    inprogress: { label: 'In Progress', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
    done: { label: 'Done', dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  };

  const priorityMap = {
    low: { badge: 'bg-slate-100 text-slate-500', dot: '🟢' },
    medium: { badge: 'bg-amber-100 text-amber-700', dot: '🟡' },
    high: { badge: 'bg-red-100 text-red-700', dot: '🔴' },
  };

  const s = statusMap[task.status] || statusMap.todo;
  const p = priorityMap[task.priority] || priorityMap.medium;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await API.put('/tasks/' + task._id, { status: newStatus });
      onUpdate(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden card-hover ${isOverdue ? 'border-red-200' : 'border-slate-100'}`} style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className={`h-1 w-full ${task.status === 'done' ? 'bg-emerald-400' : task.status === 'inprogress' ? 'bg-amber-400' : isOverdue ? 'bg-red-400' : 'bg-slate-200'}`}></div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className={`font-bold text-slate-900 leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>{task.title}</h4>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl shrink-0 ${p.badge}`}>{p.dot} {task.priority}</span>
        </div>

        {task.description && <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">{task.description}</p>}

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
            {s.label}
          </span>
          {isOverdue && <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-700">🚨 Overdue</span>}
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs font-semibold mb-4 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
            <span>📅</span>
            <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-2.5 mb-4 p-3 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Assigned to</p>
              <p className="text-xs font-bold text-slate-700">{task.assignedTo.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <select value={task.status} onChange={e => handleStatusChange(e.target.value)} disabled={updating}
            className="flex-1 text-sm border-2 border-slate-200 rounded-xl px-3 py-2 bg-white font-semibold text-slate-700 cursor-pointer focus:border-indigo-400 transition-all">
            <option value="todo">⏳ To Do</option>
            <option value="inprogress">🔄 In Progress</option>
            <option value="done">✅ Done</option>
          </select>
          {userRole === 'admin' && (
            <button onClick={() => onDelete(task._id)} className="px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100">
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;