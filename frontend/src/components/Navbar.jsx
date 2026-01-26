import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Bell, LogOut, LogIn, Settings, MoreVertical, User as UserIcon } from "lucide-react";
import authService from "../services/auth.service";

function Navbar() {
  const user = authService.getCurrentUser();
  const [showMenu, setShowMenu] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b sticky top-0 z-50">
      {/* Left: user profile */}
      <Link 
        to={user ? `/view-profile/${user._id || user.id}` : "/login"} 
        className="flex items-center gap-2 hover:opacity-80 transition"
      >
        <div className="bg-blue-100 p-1 rounded-full border-2 border-blue-50">
           {user?.profile_image ? (
             <img src={user.profile_image} className="w-9 h-9 rounded-full object-cover" alt="Profile" />
           ) : (
             <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.charAt(0) || "G"}
             </div>
           )}
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-gray-900">{user?.full_name || "Guest User"}</h1>
          <p className="text-xs text-gray-500">{user?.department || "Welcome"}</p>
        </div>
      </Link>

      {/* Middle: Search bar - Hidden for admins */}
      {!isAdmin && (
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items, categories..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      )}

      {/* Right: Buttons */}
      <div className="flex items-center gap-4 md:gap-6">
        {user ? (
          <>
            {/* Sell Item Button - Hidden for admins */}
            {!isAdmin && (
              <Link
                to="/sell_item"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-100 text-sm md:text-base whitespace-nowrap"
              >
                + Sell Item
              </Link>
            )}

            <div className="flex items-center gap-4 relative">
              {/* Messages Icon - Hidden for admins */}
              {!isAdmin && (
                <Link to="/messages" className="text-gray-600 hover:text-blue-600 transition">
                  <MessageCircle className="w-6 h-6" />
                </Link>
              )}
              
              <Link to="/notifications" className="text-gray-600 hover:text-blue-600 transition">
                <Bell className="w-6 h-6" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 rounded-full transition ${showMenu ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <MoreVertical size={24} />
                </button>

                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <Link 
                          to={`/view-profile/${user._id || user.id}`}
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
                        >
                          <UserIcon size={18} /> View Profile
                        </Link>
                        <Link 
                          to="/settings"
                          onClick={() => setShowMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
                        >
                          <Settings size={18} /> Settings
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
