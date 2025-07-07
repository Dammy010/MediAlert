import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("med_current_user")) || null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 flex flex-col">
      <main className="flex flex-col items-center justify-center text-center flex-1 px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700 max-w-2xl">
          Never Miss a Dose Again
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-6">
          Stay healthy and on track with daily medication reminders tailored
          just for you. Simple. Reliable. Free.
        </p>

        {!user ? (
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-all"
          >
            Start Now
          </Link>
        ) : (
          <Link
            to="/prescriptions/new"
            className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-700 transition-all"
          >
            + Add Reminder
          </Link>
        )}
      </main>

      <section className="bg-white py-12 px-6 md:px-12">
        <div
          className={`max-w-5xl mx-auto grid gap-8 text-center ${
            user ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              Custom Reminders
            </h3>
            <p className="text-gray-600 text-sm">
              Set flexible dosage times and receive timely alerts for every
              prescription.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              Easy Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Track all your meds in one place. Manage routines and stay
              consistent.
            </p>
          </div>
          {!user && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                Signup Now
              </h3>
              <p className="text-gray-600 text-sm">
                Get started today with a free account and never miss a dose.
                Quick, easy, and reliable!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
