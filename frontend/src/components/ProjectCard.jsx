import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COLORS = ['bg-indigo-500','bg-purple-500','bg-blue-500','bg-green-500','bg-orange-500','bg-pink-500'];

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myMembership = project.members?.find((m) => (m.user._id || m.user) === user?._id);
  const role = myMembership?.role || 'member';
  const color = COLORS[project.name?.charCodeAt(0) % COLORS.length];

  return (
    <div onClick={() => navigate(`/projects/${project._id}/tasks`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
      <div className={`${color} h-2 w-full`}></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
            <span className="text-white font-bold text-xl">{project.name?.charAt(0).toUpperCase()}</span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
            {role === 'admin' ? '👑 Admin' : '👤 Member'}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
        {project.description && <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
          <span>👥 {project.members?.length || 0} members</span>
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;