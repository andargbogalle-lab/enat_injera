import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../utils/translations';

const t = translations.nav;

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/mom.png" alt="እናት እንጀራ Logo" className="h-10 w-10 md:h-12 md:w-12" />
          <span className="text-lg md:text-2xl font-bold">እናት እንጀራ</span>
        </Link>
        
        {user && (
          <div className="flex gap-4 items-center flex-wrap justify-end">
            {user.role === 'admin' && (
              <>
                <Link 
                  to="/users" 
                  className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                    isActive('/users') 
                      ? 'bg-yellow-600 font-bold' 
                      : 'hover:bg-yellow-600'
                  }`}
                >
                  {t.users}
                </Link>
                <Link 
                  to="/employees" 
                  className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                    isActive('/employees') 
                      ? 'bg-yellow-600 font-bold' 
                      : 'hover:bg-yellow-600'
                  }`}
                >
                  {t.employees}
                </Link>
              </>
            )}

            <Link 
              to="/sales" 
              className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                isActive('/sales') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.sales}
            </Link>
            <Link 
              to="/payments" 
              className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                isActive('/payments') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.payments}
            </Link>
            <Link 
              to="/purchases" 
              className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                isActive('/purchases') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.purchases}
            </Link>
            <Link 
              to="/customers" 
              className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                isActive('/customers') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.customers}
            </Link>
            <Link 
              to="/reports" 
              className={`px-2 py-2 rounded text-xs md:text-sm transition ${
                isActive('/reports') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.reports}
            </Link>
            
            <div className="flex gap-2 items-center">
              <span className="text-xs md:text-sm">
                {user.username} 
                {user.role === 'admin' && <span className="ml-1 px-2 py-1 bg-yellow-700 rounded text-xs">{t.admin}</span>}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-2 py-2 rounded text-xs md:text-sm"
              >
                {t.logout}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
