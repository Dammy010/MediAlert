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
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("med_prescriptions", JSON.stringify(updated));
  };

  const handleEdit = (rx) => {
    localStorage.setItem("med_editing_prescription", JSON.stringify(rx));
    navigate("/prescriptions/edit");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-8">
      <div className="flex justify-center mb-10">
        <div className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-mono text-sm shadow-sm">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 mb-1">
        Welcome, {userName.split(" ")[0]}!
      </h2>
      <p className="text-gray-600 mb-6">Your upcoming prescriptions:</p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="shadow-md rounded-lg overflow-hidden max-w-xs mx-auto md:mx-0">
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            <button
              onClick={() => navigate("/prescriptions/new")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              + Add New Prescription
            </button>
          </div>
        </div>

        <div className="md:w-2/3">
          {filteredPrescriptions.length > 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg mb-6">
              <strong>{filteredPrescriptions.length}</strong> prescription(s) scheduled for{" "}
              <span className="font-semibold">{selectedDate.toDateString()}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-8">
              No prescriptions found for {selectedDate.toDateString()}
            </p>
          )}

          <div className="space-y-6">
            {Object.entries(groupByTime).map(([period, items]) => (
              <div key={period}>
                <h3 className="text-xl font-semibold text-blue-600 mb-2 border-b pb-1 flex items-center gap-2">
                  {period === "Morning" && "☀️"}
                  {period === "Afternoon" && "🌤️"}
                  {period === "Night" && "🌙"}
                  {period}
                </h3>
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No {period.toLowerCase()} reminders
                  </p>
                ) : (
                  items.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border hover:shadow transition mb-2"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {rx.medName}{" "}
                          <span className="text-sm text-gray-500">at {rx.time}</span>
                        </h4>
                        <p className="text-xs mt-1 text-gray-500">
                          Alert Type:{" "}
                          {rx.alertType === "sound"
                            ? "🔊 Sound"
                            : rx.alertType === "notification"
                            ? "🔔 Notification"
                            : "⚠️ None"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(rx)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rx.id)}
                          className="text-red-500 text-sm hover:underline"
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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
