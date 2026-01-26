import React from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Bell, LogOut, LogIn } from "lucide-react";
import authService from "../services/auth.service";

function Navbar() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b">
      {/* Left: user profile */}
      <Link to="/student" className="flex items-center gap-2 hover:opacity-80 transition">
        <div className="bg-blue-100 p-2 rounded-full">
           <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0) || "G"}
           </div>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">{user?.full_name || "Guest User"}</h1>
          <p className="text-xs text-gray-500">{user?.department || "Welcome"}</p>
        </div>
      </Link>

      {/* Middle: Search bar */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items, categories..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/sell_item"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-100"
            >
              + Sell Item
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/messages" className="relative text-gray-600 hover:text-blue-600 transition">
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">3</span>
              </Link>
              <Link to="/notifications" className="relative text-gray-600 hover:text-blue-600 transition">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">5</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition font-medium text-sm ml-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </>
        ) : (
          <Link 
            to="/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            <LogIn size={20} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
