"use client";

import { CheckCircle2, Target, Calendar } from "lucide-react";

export default function WellnessPlan() {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
      
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" /> Auto Wellness Plan
        </h2>
      </div>

      <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
        We've analyzed your Mental Health DNA. Here is your dynamically generated path for the week.
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
           <div className="mt-0.5">
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 text-sm">5-Minute Deep Breathing</h4>
             <p className="text-xs text-gray-500 mt-1">Daily. Lowers your high baseline stress.</p>
           </div>
        </div>

        <div className="flex items-start gap-4">
           <div className="mt-0.5">
             <CheckCircle2 className="w-5 h-5 text-gray-300" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 text-sm">Journal 3 Times</h4>
             <p className="text-xs text-gray-500 mt-1">Target Sunday evening anxiety preemptively.</p>
           </div>
        </div>

        <div className="flex items-start gap-4">
           <div className="mt-0.5">
             <CheckCircle2 className="w-5 h-5 text-gray-300" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 text-sm">1 Therapy Session</h4>
             <p className="text-xs text-gray-500 mt-1">Check in with Dr. Sarah Jenkins.</p>
           </div>
        </div>
      </div>

      <button className="w-full mt-8 bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 py-3 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 text-sm">
        <Calendar className="w-4 h-4" /> Add to Calendar
      </button>

    </div>
  );
}
