import React from "react";
import students from "../assets/students.png";
import { Users, ShieldCheck, Zap } from "lucide-react";

function HeroSection() {
  return (
    <div
      className="bg-cover bg-center h-screen mt-1"
      style={{ backgroundImage: `url(${students})` }}
    >
      
      <div className="flex flex-col items-center justify-center h-full bg-black/50 px-4 text-white">
        {/* Login section */}
        <li className="mb-4">
          <a href="/login" className="text-lg font-semibold hover:underline">
            Login
          </a>
        </li>
        {/* Hero text */}
        <div className="text-center mb-12">
          <p className="text-4xl font-bold mb-4">
            <span className="text-black">AASTU </span>
            <span className="bg-gradient-to-r from-[#16793A] to-[#004DB3] bg-clip-text text-transparent">
              Exchange
            </span>
            <span> Hub</span>
          </p>
          <p className="text-lg mb-2">The trusted marketplace for AASTU students.</p>
          <p className="text-lg">
            Buy, sell, and exchange items safely within your university community.
          </p>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl grid md:grid-cols-3 gap-8 text-center mt-60">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center rounded-2xl p-6 text-black shadow-md">
            <Users className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="font-bold text-lg">AASTU Students Only</h3>
            <p className="text-gray-700">
              Verified university email required for a trusted community.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center rounded-2xl p-6 text-black shadow-md">
            <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg">Safe & Secure</h3>
            <p className="text-gray-700">
              Moderated platform with admin oversight for your safety.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center  rounded-2xl p-6 text-black shadow-md">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg">Quick & Easy</h3>
            <p className="text-gray-700">
              Post items in minutes, chat directly with buyers.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;
