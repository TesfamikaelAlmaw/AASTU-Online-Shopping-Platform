import React from "react";
import { Search, MessageCircle, Bell } from "lucide-react";

 function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-lg">
          <img src="/logo.png" alt="AASTU Logo" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">AASTU Trade</h1>
          <p className="text-xs text-gray-500">Student Marketplace</p>
        </div>
      </div>

      {/* Middle: Search bar */}
      <div className="flex flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items, categories..."
            className="w-full border border-blue-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center gap-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
          + Sell Item
        </button>

        {/* Messages */}
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            2
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;