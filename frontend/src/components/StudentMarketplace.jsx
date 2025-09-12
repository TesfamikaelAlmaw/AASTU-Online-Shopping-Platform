import React from "react";
import InfoCard from "./InfoCard";

function StudentMarketplace() {
  return (
    <div className="w-full">
      {/* Hero Section for student Dashboard */}
      <div className="bg-[#C5C5D5] text-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center p-10 min-h-[70vh]">
          {/* Centered Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Find Everything You Need for <br /> Student Life
            </h1>
            <p className="mb-6 text-lg">
              Welcome to the AASTU Student Marketplace, your one-stop shop for
              all things student-related. Whether you're looking to buy, sell, or
              trade items, we've got you covered!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-2 bg-green-500 rounded-lg shadow hover:bg-green-600 transition">
                Start Shopping
              </button>
              <button className="px-6 py-2 bg-blue-700 rounded-lg shadow hover:bg-blue-800 transition">
                Sell Your Items
              </button>
            </div>
          </div>
        </div>
      </div>

      <InfoCard />
    </div>
  );
}

export default StudentMarketplace;
