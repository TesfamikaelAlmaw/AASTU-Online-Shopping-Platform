import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, AlertCircle } from "lucide-react";
import authService from "../services/auth.service";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.adminLogin({
        email,
        password,
      });
      
      if (res.user?.role === 'admin') {
        navigate("/admin");
      } else {
        setError("Access denied. Admin credentials required.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Admin login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/20">
        {/* Header with Shield Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
          <p className="text-blue-200 text-sm font-medium">Secure Administrator Access</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="text-red-300 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative">
            <label className="block text-xs font-black text-blue-200 uppercase tracking-widest mb-2 px-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
              <input
                type="email"
                placeholder="admin@aastu.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="block text-xs font-black text-blue-200 uppercase tracking-widest mb-2 px-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={20} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </span>
            ) : (
              'Access Admin Portal'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-center text-blue-200">
            Not an administrator?{" "}
            <Link to="/login" className="text-white font-bold hover:underline">
              Student Login
            </Link>
          </p>
          <p className="text-xs text-center text-blue-300/60 mt-3">
            This portal is restricted to authorized administrators only.
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

export default AdminLoginPage;
