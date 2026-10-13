import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/users', formData);
      setSuccess('User created successfully!');
      setFormData({ username: '', password: '', email: '', role: 'user' });
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const endpoint = isActive ? `/users/${userId}/deactivate` : `/users/${userId}/activate`;
      await api.post(endpoint);
      loadUsers();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-primary hover:text-yellow-700 font-semibold"
        >
          ← Back to Home
        </button>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">User Management</h1>

      {error && (
        <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm md:text-base">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 md:p-4 bg-green-100 border border-green-400 text-green-700 rounded text-sm md:text-base">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Add User Form */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                minLength="3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                minLength="6"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* Users Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4">User Statistics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded">
              <p className="text-gray-600">Admin Users</p>
              <p className="text-3xl font-bold text-orange-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg md:text-xl font-bold p-4 md:p-6 border-b">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left">Username</th>
                <th className="px-2 md:px-4 py-2 text-left">Email</th>
                <th className="px-2 md:px-4 py-2 text-left">Role</th>
                <th className="px-2 md:px-4 py-2 text-left">Status</th>
                <th className="px-2 md:px-4 py-2 text-left">Created</th>
                <th className="px-2 md:px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-2 md:px-4 py-3 font-medium text-xs md:text-base">{user.username}</td>
                  <td className="px-2 md:px-4 py-3">{user.email || '-'}</td>
                  <td className="px-2 md:px-4 py-3">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user._id, user.isActive)}
                      className={`text-xs md:text-sm font-medium px-2 md:px-3 py-1 rounded ${
                        user.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
