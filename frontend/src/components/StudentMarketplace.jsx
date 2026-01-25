import React from "react";
import { ArrowUpRight, Clock, Star } from "lucide-react";

 function StudentMarketplace() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4">
              Find Everything You Need for <br /> Student Life
            </h1>
            <p className="mb-6 text-lg">
              Buy, sell, and trade with fellow AASTU students in a safe and trusted
              marketplace.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-green-500 rounded-lg shadow hover:bg-green-600 transition">
                Start Shopping
              </button>
              <button className="px-6 py-2 bg-blue-700 rounded-lg shadow hover:bg-blue-800 transition">
                Sell Your Items
              </button>
            </div>
          </div>

          {/* Illustration (Replace with image if you have one) */}
          <div className="hidden md:block w-1/2">
            <img
              src="/student-marketplace-illustration.png"
              alt="Students trading"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto -mt-8 px-6">
        <div className="bg-blue-500 text-white rounded-2xl shadow p-6 flex flex-col items-center">
          <ArrowUpRight size={32} className="mb-3" />
          <h2 className="text-2xl font-bold">2,547</h2>
          <p>Active Listings</p>
        </div>
        <div className="bg-green-500 text-white rounded-2xl shadow p-6 flex flex-col items-center">
          <Clock size={32} className="mb-3" />
          <h2 className="text-2xl font-bold">1,234</h2>
          <p>Students Trading</p>
        </div>
        <div className="bg-orange-400 text-white rounded-2xl shadow p-6 flex flex-col items-center">
          <Star size={32} className="mb-3" />
          <h2 className="text-2xl font-bold">4.8/5</h2>
          <p>User Rating</p>
        </div>
      </div>
    </div>
  );
}

export default StudentMarketplace;