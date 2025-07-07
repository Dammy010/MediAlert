import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [userName, setUserName] = useState("User");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const playedAlertsRef = useRef({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("med_logged_in");
    const user = JSON.parse(localStorage.getItem("med_current_user"));

    if (isLoggedIn !== "true" || !user) {
      navigate("/login");
      return;
    }

    setUserName(user.name || "User");

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const saved = JSON.parse(localStorage.getItem("med_prescriptions")) || [];
    setPrescriptions(saved);
  }, [navigate]);

  useEffect(() => {
    const bell = new Audio("/bell.mp3");

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const nowTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      prescriptions.forEach((rx) => {
        const rxDate = new Date(rx.date);
        const isToday = rxDate.toDateString() === now.toDateString();

        if (rx.time === nowTime && isToday) {
          const alertKey = `${rx.id}-${nowTime}`;
          if (playedAlertsRef.current[alertKey]) return;
          playedAlertsRef.current[alertKey] = true;

          if (rx.alertType === "notification" && "Notification" in window) {
            new Notification("MediAlert", {
              body: `Time to take ${rx.medName}`,
            });
          }

          if (rx.alertType === "sound") {
            bell.play().catch((e) => console.log("Sound error:", e));
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [prescriptions]);

  const handleDelete = (id) => {
    const filtered = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(filtered);
    localStorage.setItem("med_prescriptions", JSON.stringify(filtered));
  };

  const handleEdit = (rx) => {
    localStorage.setItem("med_editing_prescription", JSON.stringify(rx));
    navigate("/prescriptions/edit");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    localStorage.removeItem("med_logged_in");
    localStorage.removeItem("med_current_user");
    navigate("/login");
  };

  const filteredPrescriptions = prescriptions
    .filter(
      (rx) =>
        !rx.date ||
        new Date(rx.date).toDateString() === selectedDate.toDateString()
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  const groupByTime = {
    Morning: filteredPrescriptions.filter(
      (rx) => parseInt(rx.time.split(":")[0]) < 12
    ),
    Afternoon: filteredPrescriptions.filter(
      (rx) =>
        parseInt(rx.time.split(":")[0]) >= 12 &&
        parseInt(rx.time.split(":")[0]) < 18
    ),
    Night: filteredPrescriptions.filter(
      (rx) => parseInt(rx.time.split(":")[0]) >= 18
    ),
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8 relative">
      {/* Top bar: Home | Clock | Logout */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition-transform transform hover:scale-105"
        >
          ⬅ Back to Home
        </button>

        <div className="text-gray-600 text-sm">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-blue-700 mb-2">
        Welcome, {userName.split(" ")[0] || "User"}!
      </h2>
      <p className="text-gray-600 mb-4">Your upcoming prescriptions:</p>

      {/* Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="mb-6 rounded-lg shadow"
      />

      {/* Add New Prescription */}
      <button
        onClick={() => navigate("/prescriptions/new")}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
      >
        + Add New Prescription
      </button>

      {/* Summary */}
      {filteredPrescriptions.length > 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
          <strong>{filteredPrescriptions.length}</strong> prescriptions scheduled for{" "}
          {selectedDate.toDateString()}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">
          No prescriptions found for {selectedDate.toDateString()}
        </p>
      )}

      {/* Grouped Prescriptions */}
      {Object.entries(groupByTime).map(([period, items]) => (
        <div key={period}>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{period}</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">
              No {period.toLowerCase()} reminders
            </p>
          ) : (
            items.map((rx) => (
              <div
                key={rx.id}
                className="p-4 bg-white rounded shadow flex justify-between items-center mb-2"
              >
                <div>
                  <strong>{rx.medName}</strong>{" "}
                  <span className="text-sm text-gray-500">at {rx.time}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Alert:{" "}
                    {rx.alertType === "sound"
                      ? "🔔 Sound"
                      : rx.alertType === "notification"
                      ? "🔔 Notification"
                      : "⚠️ None"}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(rx)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rx.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
