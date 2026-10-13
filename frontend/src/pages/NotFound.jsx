import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-8 md:py-12">
        <div className="text-center max-w-2xl w-full">
          {/* Logo - larger on desktop */}
          <div className="mb-8">
            <img src="/mom.png" alt="እናት እንጀራ Logo" className="h-20 w-20 md:h-32 md:w-32 mx-auto" />
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl md:text-8xl font-black text-primary mb-4">404</h1>
          
          {/* Error Message */}
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-sm md:text-lg text-gray-600 mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist. It might have been removed or the URL might be incorrect.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 md:px-8 py-2 md:py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg transition text-sm md:text-base"
            >
              Go Back
            </button>
            
            <Link
              to={user ? "/sales" : "/"}
              className="px-4 md:px-8 py-2 md:py-3 bg-primary hover:bg-yellow-600 text-white font-bold rounded-lg transition text-sm md:text-base text-center"
            >
              {user ? "Go to Dashboard" : "Go to Home"}
            </Link>
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-xs md:text-sm text-gray-500">
            <p>Need help? Contact support or navigate using the menu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
