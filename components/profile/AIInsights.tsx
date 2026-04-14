"use client";

import { Sparkles, Heart, Briefcase, Users } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white rounded-[32px] p-8 shadow-sm border border-purple-100 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 relative z-10">
          <Sparkles className="w-5 h-5 text-purple-500" /> AI Insights
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors">
          <p className="font-medium text-gray-700 text-sm italic">"You tend to experience a sharp spike in anxiety late on Sunday evenings, right before the work week begins."</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors">
          <p className="font-medium text-gray-700 text-sm italic">"Your highest mood scores are almost always on days where you've completed a morning meditation."</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-purple-100 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Emotional Triggers Map</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white border border-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Briefcase className="w-3 h-3" /> Work ⬇️
          </span>
          <span className="bg-white border border-emerald-100 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Heart className="w-3 h-3" /> Relationships ⬆️
          </span>
          <span className="bg-white border border-blue-100 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Users className="w-3 h-3" /> Socializing ⬆️
          </span>
        </div>
      </div>
    </div>
  );
}
