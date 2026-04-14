"use client";

import { Flame, Medal, Award } from "lucide-react";

export default function ProfileStats({ stats }: { stats?: any }) {
  const { streak = 0, sessions = 0, avgMood = 0, meditationMinutes = 0, journalCount = 0 } = stats || {};

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <Medal className="w-5 h-5 text-yellow-500" /> Gamification & Stats
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-125 transition-transform duration-300" />
            <p className="text-2xl font-black text-orange-600">{streak}</p>
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">Day Streak</p>
         </div>
         <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-center group hover:scale-[1.02] transition-transform">
            <Award className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:scale-125 transition-transform duration-300" />
            <p className="text-2xl font-black text-indigo-600">{sessions}</p>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Sessions</p>
         </div>
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-6">
         <div className="flex justify-between items-center text-sm">
           <span className="font-bold text-gray-500">Avg Mood Score</span>
           <span className="font-black text-gray-900">{avgMood} / 100</span>
         </div>
         <div className="flex justify-between items-center text-sm">
           <span className="font-bold text-gray-500">Meditation Mins</span>
           <span className="font-black text-gray-900">{meditationMinutes}m</span>
         </div>
         <div className="flex justify-between items-center text-sm">
           <span className="font-bold text-gray-500">Journal Entries</span>
           <span className="font-black text-emerald-600">{journalCount}</span>
         </div>
      </div>
    </div>
  );
}
