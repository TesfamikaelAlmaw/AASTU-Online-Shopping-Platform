import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({
        email,
        password,
      });

      // This should only allow students now
      if (res.user?.role === "student") {
        navigate("/student");
      } else {
        alert("Unexpected user role. Please contact support.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";

      // Check if it's an admin trying to login
      if (
        errorMessage.includes("admin portal") ||
        errorMessage.includes("Admin users")
      ) {
        alert(
          "Admin users must login through the Admin Portal. Redirecting...",
        );
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden px-4 py-6 md:py-10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
        {/* Left Panel */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-widest text-blue-100">
              AASTU Marketplace
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight">
              Welcome back,
              <br />
              Student!
            </h1>
            <p className="mt-3 text-blue-100">
              Buy, sell, and discover items within your campus community.
            </p>
          </div>
          <div className="relative text-sm text-blue-100">
            Secure login with your university account.
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-10 bg-white/5">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Student Login
            </h2>
            <p className="text-blue-200 mt-2">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-xs font-black text-blue-200 uppercase tracking-widest mb-2 px-1">
              University Email
            </label>
            <input
              type="email"
              placeholder="name@aastu.edu.et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <label className="text-xs font-black text-blue-200 uppercase tracking-widest mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-medium"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-blue-200">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white font-bold hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-center text-blue-200">
              Administrator?{" "}
              <Link
                to="/admin/login"
                className="text-white font-bold hover:underline"
              >
                Access Admin Portal
              </Link>
            </p>
          </div>
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

export default LoginPage;
