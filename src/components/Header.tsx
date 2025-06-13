
import { Search, Bell, User, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAccountClick = () => {
    // For now, just sign out - you can create an account page later
    signOut();
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {!isHomePage && (
              <button 
                onClick={handleBackClick}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mandi Mitra</h1>
                <p className="text-gray-500 text-xs font-medium">Predict. Sell. Earn.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAccountClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
