import { Users, ShieldCheck, Zap } from "lucide-react";
import React from 'react'
function FeatureCard() {
  return (
        <div className="w-full max-w-6xl grid md:grid-cols-3 gap-8 text-center mt-40">
          {/* Feature 1 */}
          <div className="flex flex-col items-center rounded-3xl p-6 text-black shadow-md border-2 bg-cyan-400 opacity-80">
            <Users className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="font-bold text-lg">AASTU Students Only</h3>
            <p className="text-gray-700">
              Verified university email required for a trusted community.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center rounded-3xl p-6 text-black shadow-md border-2 bg-blue-400 opacity-80">
            <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg">Safe & Secure</h3>
            <p className="text-gray-700">
              Moderated platform with admin oversight for your safety.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center rounded-3xl p-6 text-black shadow-md opacity-80 bg-fuchsia-100">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg">Quick & Easy</h3>
            <p className="text-gray-700">
              Post items in minutes, chat directly with buyers.
            </p>
          </div>
        </div>
  )
}

export default FeatureCard