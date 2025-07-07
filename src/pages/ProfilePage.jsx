import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('med_logged_in');
    const storedUser = JSON.parse(localStorage.getItem('med_user'));

    if (!isLoggedIn || !storedUser) return navigate('/login');
    setUser(storedUser);
    setNewName(storedUser.name);
  }, []);

  const handleUpdate = () => {
    if (!newName.trim()) return toast.error('Name cannot be empty');
    const updatedUser = { ...user, name: newName };
    localStorage.setItem('med_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success('Name updated successfully');
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('med_user', JSON.stringify(updatedUser));
    toast.success('Password updated successfully');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Profile</h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-gray-600">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUpdate}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Name
          </button>
        </div>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold text-gray-700 mb-2">Change Password</h3>
        <div className="mb-2">
          <label className="text-sm text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <label className="text-sm text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
