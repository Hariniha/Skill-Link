import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedRole } = useAuthStore();

  const handleRoleSelect = (role: 'client' | 'worker') => {
    setSelectedRole(role);
    navigate('/login');
  };

  return (
    <div className="card fade-in p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Join SkillLink</h1>
      <p className="text-neutral-600 text-center mb-8">
        Select how you want to use SkillLink
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleRoleSelect('client')}
          className="p-6 border-2 rounded-lg hover:border-primary-500 transition-colors text-left flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <User size={32} className="text-primary-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">I'm a Client</h2>
          <p className="text-neutral-600 text-sm text-center">
            Looking to hire skilled professionals for my projects
          </p>
        </button>

        <button
          onClick={() => handleRoleSelect('worker')}
          className="p-6 border-2 rounded-lg hover:border-primary-500 transition-colors text-left flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
            <Briefcase size={32} className="text-primary-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">I'm a Worker</h2>
          <p className="text-neutral-600 text-sm text-center">
            Offering my professional skills and services to clients
          </p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;