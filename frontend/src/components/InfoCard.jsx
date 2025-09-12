import React from 'react'
import { ArrowUpRight, Clock, Star } from "lucide-react";

function InfoCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mt-32 border-0 w-full h-96 p-10">
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
  )
}

export default InfoCard
