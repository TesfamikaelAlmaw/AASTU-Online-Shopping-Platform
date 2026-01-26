import React from "react";
import { Search, MessageCircle, Bell } from "lucide-react";
import profle from "../assets/profile.jpg";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      {/* Left: user profile */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <img src={profle} alt="AASTU Logo" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Tesfamicahel</h1>
          <p className="text-xs text-gray-500">Software Enginnering</p>
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
        {/* Sell Item */}
        <Link
          to="/sell_item"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium inline-block"
        >
          + Sell Item
        </Link>

        {/* Messages */}
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-gray-700" />
          <Link
            to="/messages"
            className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            3
          </Link>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-700" />
          <Link
            to="/notifications"
            className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            5
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
