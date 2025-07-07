import React from "react";
import PrescriptionForm from "../features/prescriptions/PrescriptionForm";
import { useNavigate } from "react-router-dom";

const AddPrescriptionPage = () => {
  const navigate = useNavigate();

  const handleAdd = (newRx) => {
    const existing = JSON.parse(localStorage.getItem("med_prescriptions")) || [];
    const updated = [...existing, newRx];
    localStorage.setItem("med_prescriptions", JSON.stringify(updated));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Add Prescription</h2>
      <PrescriptionForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddPrescriptionPage;