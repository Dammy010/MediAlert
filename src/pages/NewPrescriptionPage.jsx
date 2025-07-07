import React from 'react';
import { useNavigate } from 'react-router-dom';
import PrescriptionForm from '../features/prescriptions/PrescriptionForm';

const NewPrescriptionPage = () => {
  const navigate = useNavigate();

  const handleAdd = (newRx) => {
    const saved = JSON.parse(localStorage.getItem('med_prescriptions')) || [];
    const updated = [...saved, newRx];
    localStorage.setItem('med_prescriptions', JSON.stringify(updated));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New Prescription</h2>
      <PrescriptionForm onSubmit={handleAdd} />
    </div>
  );
};

export default NewPrescriptionPage;
