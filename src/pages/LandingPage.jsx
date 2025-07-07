import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ Get actual user object from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("med_current_user")) || null;
    } catch {
      return null;
    }
  })();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("med_logged_in");
    localStorage.removeItem("med_current_user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFirstName = (name) => {
    if (!name || typeof name !== "string") return "User";
    return name.split(" ")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
        <h1 className="text-2xl font-bold text-blue-600">MediAlert</h1>

        <nav className="relative" ref={dropdownRef}>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {getFirstName(user.name)[0]}
                  </div>
                  <span className="font-medium text-blue-700">
                    {getFirstName(user.name)}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="text-sm font-medium text-blue-500 hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center flex-1 px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-700 max-w-2xl">
          Never Miss a Dose Again
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-6">
          Stay healthy and on track with daily medication reminders tailored
          just for you. Simple. Reliable. Free.
        </p>
        {!user && (
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition-all"
          >
            Start Now
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


      <footer className="text-center py-6 text-sm text-gray-500 bg-blue-50 border-t">
        &copy; {new Date().getFullYear()} MediAlert. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
