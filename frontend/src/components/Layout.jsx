import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = user ? [
    { label: 'Sales', path: '/sales', role: 'all' },
    { label: 'Payments', path: '/payments', role: 'all' },
    { label: 'Purchases', path: '/purchases', role: 'all' },
    { label: 'Customers', path: '/customers', role: 'all' },
    { label: 'Reports', path: '/reports', role: 'all' },
    { label: 'Users', path: '/users', role: 'admin' },
    { label: 'Employees', path: '/employees', role: 'admin' },
  ].filter(item => item.role === 'all' || user?.role === 'admin') : [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar - Hidden on mobile, visible on md and up */}
      <div
        className={`${
          sidebarOpen ? 'fixed' : 'hidden'
        } md:relative md:block w-64 bg-white border-r border-gray-200 p-4 md:p-6 z-50 md:z-0 min-h-screen overflow-y-auto transition-all duration-300`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 mt-4 md:mt-0">
          <img src="/mom.png" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg text-primary hidden sm:inline">እናት እንጀራ</span>
        </div>

        {/* Navigation Menu */}
        {user && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
              Menu
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition text-sm md:text-base ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary font-bold'
                    : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
              Account
            </p>
            <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Logged in as</p>
              <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ☰
          </button>
          <img src="/mom.png" alt="Logo" className="h-8 w-8" />
          <div className="w-6" />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
