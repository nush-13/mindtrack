"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Sparkles, Trophy, Star } from "lucide-react";

interface GamificationContextType {
  showXpGain: (xp: number, message: string, leveledUp?: boolean) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error("useGamification must be used within GamificationProvider");
  return context;
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [popup, setPopup] = useState<{ xp: number; message: string; leveledUp?: boolean; id: number } | null>(null);

  const showXpGain = useCallback((xp: number, message: string, leveledUp?: boolean) => {
    const id = Date.now();
    setPopup({ xp, message, leveledUp, id });
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setPopup(prev => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  return (
    <GamificationContext.Provider value={{ showXpGain }}>
      {children}
      
      {/* Gamification Popup Overlay */}
      {popup && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in zoom-in duration-500 ease-out">
          <div className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl shadow-2xl p-1 pb-1 px-1 border border-white/20 flex flex-col items-center overflow-hidden">
             
             {/* Sparkles background effect */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
             
             <div className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 flex items-center gap-4 relative z-10 w-full min-w-[320px]">
                
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce relative">
                   <div className="absolute -top-1 -right-1 animate-ping-slow">✨</div>
                   {popup.leveledUp ? <Trophy className="w-6 h-6 text-yellow-900" /> : <Star className="w-6 h-6 text-yellow-900" />}
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200 drop-shadow-sm">
                       +{popup.xp} XP
                     </span>
                     {popup.leveledUp && (
                       <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse">
                         Level Up!
                       </span>
                     )}
                   </div>
                   <p className="text-indigo-100 text-sm font-semibold tracking-wide">
                     {popup.message}
                   </p>
                </div>

             </div>

             {/* Progress Bar visual effect */}
             <div className="h-1 bg-white/20 w-full mt-0.5 mb-0.5 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 w-full animate-[shrink_4s_linear_forwards]"></div>
             </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-ping-slow {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </GamificationContext.Provider>
  );
};
