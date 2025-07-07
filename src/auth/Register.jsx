import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirm } = form;

    if (!name || !email || !phone || !password || !confirm) {
      toast.error("❌ Please fill in all fields.");
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      toast.error("❌ Phone number must be 11 digits.");
      return;
    }

    if (password.length < 6) {
      toast.error("❌ Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      toast.error("❌ Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("med_users")) || [];
    const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    const phoneExists = users.some((u) => u.phone === phone);

    if (emailExists) {
      toast.error("❌ Email already exists.");
      return;
    }

    if (phoneExists) {
      toast.error("❌ Phone number already exists.");
      return;
    }

    const newUser = {
      name,
      email: email.toLowerCase(),
      phone,
      password,
      verified: true,
    };

    users.push(newUser);
    localStorage.setItem("med_users", JSON.stringify(users));

    localStorage.setItem("med_logged_in", "true");
    localStorage.setItem("med_current_user", JSON.stringify(newUser));

    toast.success("✅ Account created successfully!");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          <Input label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Reusable Input with password toggle
const Input = ({ label, name, type = "text", value, onChange }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-2 text-sm text-blue-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Signup;
