import React from "react";
import students from "../assets/students.png";
import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";

function HeroSection() {
  return (
    <div
      className="relative bg-cover bg-center h-screen mt-1"
      style={{ backgroundImage: `url(${students})` }}
    >
      {/* Login button - top right */}
      <div className="absolute top-6 right-8">
        <Link
          to="/login"
          className="px-5 py-2 bg-white text-black rounded-lg font-semibold shadow hover:bg-gray-200 transition"
        >
          Login
        </Link>
      </div>

      {/* Overlay */}
      <div className="flex flex-col items-center justify-center h-full bg-black/50 px-4 text-white">
        {/* Hero text */}
        <div className="text-center mb-5 mt-10">
          <p className="text-4xl font-bold mb-4">
            <span className="text-black">AASTU </span>
            <span className="bg-gradient-to-r from-[#16793A] to-[#004DB3] bg-clip-text text-transparent">
              Exchange
            </span>
            <span> Hub</span>
          </p>
          <p className="text-lg mb-2">
            The trusted marketplace for AASTU students.
          </p>
          <p className="text-lg">
            Buy, sell, and exchange items safely within your university
            community.
          </p>
        </div>
<FeatureCard/>
       
      </div>
    </div>
  );
}

export default HeroSection;
