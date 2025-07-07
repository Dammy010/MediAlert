import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleProceed = () => {
    const trimmedPhone = phone.trim();
    const users = JSON.parse(localStorage.getItem('med_users')) || [];
    const index = users.findIndex(u => u.phone === trimmedPhone);

    if (!trimmedPhone) return toast.error('❌ Please enter your phone number.');
    if (index === -1) return toast.error('❌ Phone number not found.');
    if (!users[index].verified) return toast.error('❌ Phone number is not verified.');

    setCurrentUserIndex(index);
    setStep(2);
    setResendCooldown(30);
    toast.success(`✅ Continue with any 4-digit code.`);
  };

  const verifyAndReset = () => {
    if (otpInput.length !== 4 || isNaN(otpInput)) {
      return toast.error('❌ Please enter a valid 4-digit code.');
    }

    if (newPassword.length < 6) return toast.error('❌ Password must be at least 6 characters.');
    if (newPassword !== confirm) return toast.error('❌ Passwords do not match.');

    const users = JSON.parse(localStorage.getItem('med_users')) || [];
    if (currentUserIndex === null || !users[currentUserIndex]) {
      return toast.error('❌ User session error. Please try again.');
    }

    users[currentUserIndex].password = newPassword;
    localStorage.setItem('med_users', JSON.stringify(users));

    setStep(1);
    setPhone('');
    setOtpInput('');
    setNewPassword('');
    setConfirm('');
    setCurrentUserIndex(null);

    toast.success('✅ Password reset successful!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Reset Password via Phone
        </h2>

        {step === 1 && (
          <>
            <label className="block text-sm text-gray-700 mb-1">Enter your phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="e.g. 08012345678"
            />
            <button
              onClick={handleProceed}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-sm text-gray-700 mb-1">Enter any 4-digit code</label>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
              placeholder="e.g., 1234"
            />

            <label className="block text-sm text-gray-700 mb-1">New Password</label>
            <div className="relative mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-sm text-blue-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="••••••••"
            />

            <button
              onClick={verifyAndReset}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
