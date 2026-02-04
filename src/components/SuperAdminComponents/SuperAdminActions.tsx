// components/superadmin/SuperAdminActions.tsx
import { UserPlus, Shield, Briefcase, Video, Package, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Manage Users',
      icon: Users,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-300',
      path: '/superadmin/manage-users'
    },
    {
      title: 'Pending Approvals',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      path: '/superadmin/pending-registrations'
    },
    {
      title: 'Executives',
      icon: Briefcase,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      path: '/superadmin/executives'
    },
    {
      title: 'Webinars',
      icon: Video,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      path: '/superadmin/webinars'
    },
    {
      title: 'Packages',
      icon: Package,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      path: '/superadmin/packages'
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => navigate(action.path)}
          className={`${action.bgColor} ${action.borderColor} border-2 rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <action.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 text-center">
            {action.title}
          </p>
        </button>
      ))}
    </div>
  );
};

export default SuperAdminActions;
