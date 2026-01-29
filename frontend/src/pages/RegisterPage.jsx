// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden px-4 py-6 md:py-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
        {/* Left Panel */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-widest text-emerald-100">
              Join AASTU
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight">
              Create your
              <br />
              student account
            </h1>
            <p className="mt-3 text-emerald-100">
              List your items and discover deals across campus.
            </p>
          </div>
          <div className="relative text-sm text-emerald-100">
            It takes less than a minute to get started.
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-6 md:p-8 bg-white/5">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Register
            </h2>
            <p className="text-emerald-200 mt-2">
              Create your account to start selling.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-2 px-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <label className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-2 px-1">
              University Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@aastu.edu.et"
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <label className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <label className="text-xs font-black text-emerald-200 uppercase tracking-widest mb-2 px-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Software Engineering"
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-emerald-200">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
