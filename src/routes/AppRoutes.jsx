import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import LandingPage from "../pages/LandingPage";
import Login from "../auth/Login";
import Register from "../auth/Register";
import DashboardPage from "../pages/DashboardPage"
import ProfilePage from "../pages/ProfilePage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AddPrescriptionPage from "../pages/AddPrescriptionPage";
import EditPrescriptionPage from "../pages/EditPrescriptionPage";
import NewPrescriptionPage from "../pages/NewPrescriptionPage";
import About from "../pages/About";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-prescription" element={<AddPrescriptionPage />} />
        <Route path="/prescriptions/edit" element={<EditPrescriptionPage />} />
        <Route path="/prescriptions/new" element={<NewPrescriptionPage />} />
        <Route path="/about" element={<About />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="*"
        element={
          <div className="text-center mt-20 text-gray-500">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
