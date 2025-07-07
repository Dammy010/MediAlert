import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">About MediAlert</h1>

        <p className="text-gray-700 text-lg mb-4">
          <strong>MediAlert</strong> is your personal medication reminder app, built to help you
          stay consistent with your prescriptions and never miss a dose again.
        </p>

        <p className="text-gray-600 mb-6">
          Whether you’re managing chronic conditions or just daily vitamins, MediAlert offers a
          seamless way to schedule your medicine and get timely alerts—either as sound or push
          notifications.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
          <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">🕒 Timely Reminders</h2>
            <p className="text-gray-700 text-sm">
              Set exact times and dates for when to take each medication, and we’ll alert you
              instantly.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">💡 Simple Interface</h2>
            <p className="text-gray-700 text-sm">
              Our dashboard is designed to be intuitive and user-friendly, even for older users.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">🔔 Custom Alerts</h2>
            <p className="text-gray-700 text-sm">
              Choose between sound or browser notification reminders—whatever works best for you.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
