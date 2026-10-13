import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../utils/translations';

const t = translations.nav;

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-3 md:px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/mom.png" alt="እናት እንጀራ Logo" className="h-10 w-10 md:h-12 md:w-12" />
          <span className="text-lg md:text-2xl font-bold hidden sm:inline">እናት እንጀራ</span>
        </Link>
        
        {user && (
          <>
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-2 items-center flex-1 justify-center">
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/users" 
                    className={`px-3 py-2 rounded text-sm transition ${
                      isActive('/users') 
                        ? 'bg-yellow-600 font-bold' 
                        : 'hover:bg-yellow-600'
                    }`}
                  >
                    {t.users}
                  </Link>
                  <Link 
                    to="/employees" 
                    className={`px-3 py-2 rounded text-sm transition ${
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
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/sales') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                {t.sales}
              </Link>
              <Link 
                to="/payments" 
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/payments') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                {t.payments}
              </Link>
              <Link 
                to="/purchases" 
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/purchases') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                {t.purchases}
              </Link>
              <Link 
                to="/customers" 
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/customers') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                {t.customers}
              </Link>
              <Link 
                to="/reports" 
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/reports') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                {t.reports}
              </Link>
              <Link 
                to="/loans" 
                className={`px-3 py-2 rounded text-sm transition ${
                  isActive('/loans') 
                    ? 'bg-yellow-600 font-bold' 
                    : 'hover:bg-yellow-600'
                }`}
              >
                Loans
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white text-2xl hover:bg-yellow-600 p-2 rounded"
              title="Menu"
            >
              ☰
            </button>

            {/* Desktop User Section */}
            <div className="hidden md:flex gap-2 items-center flex-shrink-0">
              <span className="text-sm">
                {user.username} 
                {user.role === 'admin' && <span className="ml-1 px-2 py-1 bg-yellow-700 rounded text-xs">{t.admin}</span>}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
              >
                {t.logout}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {user && menuOpen && (
        <div className="md:hidden bg-primary bg-opacity-95 border-t border-yellow-600">
          <div className="container mx-auto px-3 py-2 space-y-1 flex flex-col">
            {user.role === 'admin' && (
              <>
                <Link 
                  to="/users" 
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded text-sm transition ${
                    isActive('/users') 
                      ? 'bg-yellow-600 font-bold' 
                      : 'hover:bg-yellow-600'
                  }`}
                >
                  {t.users}
                </Link>
                <Link 
                  to="/employees" 
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded text-sm transition ${
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
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/sales') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.sales}
            </Link>
            <Link 
              to="/payments" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/payments') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.payments}
            </Link>
            <Link 
              to="/purchases" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/purchases') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.purchases}
            </Link>
            <Link 
              to="/customers" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/customers') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.customers}
            </Link>
            <Link 
              to="/reports" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/reports') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              {t.reports}
            </Link>
            <Link 
              to="/loans" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded text-sm transition ${
                isActive('/loans') 
                  ? 'bg-yellow-600 font-bold' 
                  : 'hover:bg-yellow-600'
              }`}
            >
              Loans
            </Link>

            {/* Mobile User Section */}
            <div className="border-t border-yellow-600 pt-2 mt-2">
              <div className="px-3 py-2 text-sm">
                {user.username} 
                {user.role === 'admin' && <span className="ml-1 px-2 py-1 bg-yellow-700 rounded text-xs">{t.admin}</span>}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm text-left"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
