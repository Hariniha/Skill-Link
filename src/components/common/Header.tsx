import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

interface HeaderProps {
  userRole?: 'client' | 'worker';
}

const Header: React.FC<HeaderProps> = ({ userRole }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/select-role' },
      ];
    }

    if (userRole === 'client') {
      return [
        { name: 'Dashboard', path: '/client/dashboard' },
        { name: 'Find Workers', path: '/client/search' },
        { name: 'My Bookings', path: '/client/bookings' },
        { name: 'Messages', path: '/client/messages' },
      ];
    }

    if (userRole === 'worker') {
      return [
        { name: 'Dashboard', path: '/worker/dashboard' },
        { name: 'Bookings', path: '/worker/bookings' },
        { name: 'Earnings', path: '/worker/earnings' },
        { name: 'Messages', path: '/worker/messages' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-primary-500 font-bold text-xl mr-1">Skill</div>
            <div className="text-secondary-500 font-bold text-xl">Link</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-neutral-700 hover:text-primary-500 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to={`/${userRole}/messages`} className="text-neutral-600 hover:text-primary-500">
                  <MessageSquare size={20} />
                </Link>
                <div className="relative">
                  <Bell size={20} className="text-neutral-600 hover:text-primary-500 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </div>
                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={user?.profileImage || 'https://via.placeholder.com/40'} 
                        alt={user?.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link 
                      to={`/${userRole}/profile`} 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-neutral-800">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="bg-white p-4 md:hidden border-t border-neutral-100 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-neutral-700 hover:text-primary-500 font-medium"
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={user?.profileImage || 'https://via.placeholder.com/40'} 
                        alt={user?.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-sm text-neutral-500">{user?.email}</div>
                    </div>
                  </div>
                  <Link 
                    to={`/${userRole}/profile`} 
                    className="flex items-center text-neutral-700 hover:text-primary-500 py-2"
                    onClick={closeMenu}
                  >
                    <User size={18} className="mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-neutral-700 hover:text-primary-500 py-2"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;