import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrescriptionForm from '../features/prescriptions/PrescriptionForm';

const EditPrescriptionPage = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('med_editing_prescription');
    if (!stored) {
      navigate('/dashboard');
      return;
    }

    try {
      const data = JSON.parse(stored);
      if (data && typeof data === 'object') {
        if (!data.alertType) {
          data.alertType = 'notification'; 
        }
        setInitialData(data);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error parsing prescription:', err);
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleUpdate = (updatedRx) => {
    try {
      const all = JSON.parse(localStorage.getItem('med_prescriptions')) || [];
      const index = all.findIndex((rx) => rx.id === updatedRx.id);
      if (index !== -1) {
        all[index] = updatedRx;
        localStorage.setItem('med_prescriptions', JSON.stringify(all));
      }
    } catch (err) {
      console.error('Failed to update prescription:', err);
    }

    localStorage.removeItem('med_editing_prescription');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Prescription</h2>
      {initialData ? (
        <PrescriptionForm onSubmit={handleUpdate} initialData={initialData} />
      ) : (
        <p className="text-gray-500">Loading prescription...</p>
      )}
    </div>
  );
};

export default EditPrescriptionPage;
