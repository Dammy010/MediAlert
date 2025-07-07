import React, { useState, useEffect } from 'react';

const PrescriptionForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    medName: '',
    time: '',
    date: '',
    alertType: 'notification',
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        alertType: initialData.alertType || 'notification' 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.medName || !form.time || !form.date) return;

    onSubmit(form);

    if (!initialData) {
      setForm({
        medName: '',
        time: '',
        date: '',
        alertType: 'notification',
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
        <input
          type="text"
          name="medName"
          className="w-full border px-4 py-2 rounded"
          value={form.medName}
          onChange={handleChange}
          placeholder="e.g., Paracetamol"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reminder Date</label>
        <input
          type="date"
          name="date"
          className="w-full border px-4 py-2 rounded"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reminder Time</label>
        <input
          type="time"
          name="time"
          className="w-full border px-4 py-2 rounded"
          value={form.time}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alert Type</label>
        <select
          name="alertType"
          className="w-full border px-4 py-2 rounded"
          value={form.alertType}
          onChange={handleChange}
          required
        >
          <option value="notification">🔔 Notification</option>
          <option value="sound">🔊 Sound (Bell)</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {initialData ? 'Update Reminder' : 'Add Reminder'}
      </button>
    </form>
  );
};

export default PrescriptionForm;
