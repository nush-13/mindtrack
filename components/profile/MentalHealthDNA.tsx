"use client";

import { Brain, HeartPulse, Smile, Zap } from "lucide-react";

export default function MentalHealthDNA({ dna }: { dna?: any }) {
  const { stress = "Medium", stressPct = 50, stability = "Medium", stabilityPct = 50, social = "Medium", socialPct = 50 } = dna || {};

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-gray-100 group hover:shadow-xl transition-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-150 transition-transform duration-1000">
        <Brain className="w-64 h-64" />
      </div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <Brain className="w-6 h-6 text-indigo-500" /> Mental Health DNA
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Your personalized psychological profile</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Metric 1 */}
        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="flex items-center gap-2 text-rose-600"><HeartPulse className="w-4 h-4" /> Stress Level</span>
            <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">{stress}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-1000" style={{ width: `${stressPct}%` }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="flex items-center gap-2 text-blue-600"><Smile className="w-4 h-4" /> Emotional Stability</span>
            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">{stability}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${stabilityPct}%` }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div>
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="flex items-center gap-2 text-emerald-600"><Zap className="w-4 h-4" /> Social Energy</span>
            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">{social}</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${socialPct}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
