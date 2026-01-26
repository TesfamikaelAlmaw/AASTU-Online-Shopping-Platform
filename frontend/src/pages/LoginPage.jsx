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
      if (res.user?.role === 'student') {
        navigate("/student");
      } else {
        alert("Unexpected user role. Please contact support.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      
      // Check if it's an admin trying to login
      if (errorMessage.includes("admin portal") || errorMessage.includes("Admin users")) {
        alert("Admin users must login through the Admin Portal. Redirecting...");
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Student Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            Administrator?{" "}
            <Link to="/admin/login" className="text-blue-600 font-semibold hover:underline">
              Access Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

