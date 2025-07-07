import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('med_user'));
    const isLoggedIn = localStorage.getItem('med_logged_in');

    if (!storedUser || !isLoggedIn) {
      toast.error('You must be logged in');
      return navigate('/login');
    }

    if (storedUser.verified) {
      toast.success('Email already verified!');
      return navigate('/dashboard');
    }

    setUser(storedUser);
  }, [navigate]);

  const handleSendCode = () => {
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generated);
    toast.success(`Verification code sent: ${generated}`);
  };

  const handleVerify = () => {
    if (code === sentCode) {
      const updatedUser = { ...user, verified: true };
      localStorage.setItem('med_user', JSON.stringify(updatedUser));
      setVerified(true);
      toast.success('Email verified!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      toast.error('Invalid verification code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Verify Your Email
        </h2>

        {!sentCode ? (
          <button
            onClick={handleSendCode}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Verification Code
          </button>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mt-4">
              Enter the code sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerify}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Verify Email
            </button>
          </>
        )}

        {verified && <p className="text-green-600 mt-4 text-center">You’re verified!</p>}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
