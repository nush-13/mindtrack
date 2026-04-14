"use client";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";

const WELCOME_ICONS = ["🌸", "🧘", "✨"];
const GROUP_MEDITATION_ICONS = ["🧘‍♀️", "🧘‍♂️", "🧘"];
const PEACE_BANNERS = [
  { icon: '🕊️', title: 'Peace', bg: 'bg-[#f4ebfe]', border: 'border-[#ebd9fe]' },
  { icon: '🌸', title: 'Serenity', bg: 'bg-[#ffebf4]', border: 'border-[#fed9ea]' },
  { icon: '🌅', title: 'Mindfulness', bg: 'bg-[#ffeedc]', border: 'border-[#fedbb6]' },
  { icon: '💫', title: 'Harmony', bg: 'bg-[#eaeffe]', border: 'border-[#d6dffe]' }
];
const NAV_CARDS = [
  { link: '/mood', title: 'Log Mood', sub: 'Track your emotions', icon: '😊', color: 'to-[#913acc]', from: 'from-[#bb66ff]', shadow: 'shadow-purple-300/40' },
  { link: '/journal', title: 'Write Journal', sub: 'Express your thoughts', icon: '📝', color: 'to-[#e91e63]', from: 'from-[#ff6b9e]', shadow: 'shadow-pink-300/40' },
  { link: '/meditation', title: 'Meditate', sub: 'Find inner peace', icon: '🧘', color: 'to-[#2196f3]', from: 'from-[#64b5f6]', shadow: 'shadow-blue-300/40' },
  { link: '/therapy', title: 'Therapy Paths', sub: 'Guided journeys', icon: '🌱', color: 'to-[#2e7d32]', from: 'from-[#66bb6a]', shadow: 'shadow-green-300/40' }
];

export default function Home() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ avgMood: 0, journalCount: 0, meditationMinutes: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/user/analytics', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
        
        {/* MAIN WELCOME BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#6e22bc] via-[#913acc] to-[#674ee5] rounded-[32px] p-10 md:p-12 shadow-[0_15px_40px_-10px_rgba(156,81,224,0.4)] group">
           {/* Abstract Decorative Circles */}
           <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-1000"></div>
           <div className="absolute top-[10%] right-[5%] w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-[2s]"></div>
           <div className="absolute bottom-[-30%] right-[12%] w-56 h-56 bg-white/5 rounded-full group-hover:translate-x-[-20px] transition-transform duration-[3s]"></div>
           
           <div className="relative z-10">
             <h1 className="text-white text-3xl md:text-[38px] font-bold mb-3 tracking-tight leading-tight">
               Welcome to Your Mental Wellness Journey
             </h1>
             <p className="text-white/80 text-lg mb-8 font-medium">Take a moment to breathe, reflect, and nurture your mind</p>
             
             <div className="flex gap-4">
                {WELCOME_ICONS.map((icon, i) => (
                 <div key={i} className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/20 cursor-pointer hover:bg-white/30 hover:scale-110 transition-all duration-300 animate-float`} style={{animationDelay: `${i * 0.5}s`}}>
                   {icon}
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#f3ebf9] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100/50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <p className="text-gray-500 text-[13px] font-semibold uppercase tracking-wider mb-2">Mood Score</p>
                 <h2 className="text-4xl font-black text-[#56228e] mb-2">{stats.avgMood || 0}</h2>
                 <p className="text-[13px] text-gray-500 font-medium mt-1">Keep tracking! 📈</p>
               </div>
               <div className="w-[52px] h-[52px] rounded-2xl bg-[#f4edfa] flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform duration-500">
                 😊
               </div>
             </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#f3ebf9] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 delay-75">
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-100/50 rounded-[40px] rotate-45 group-hover:rotate-90 group-hover:scale-150 transition-all duration-700"></div>
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <p className="text-gray-500 text-[13px] font-semibold uppercase tracking-wider mb-2">Journal Entries</p>
                 <h2 className="text-4xl font-black text-[#d9487c] mb-2">{stats.journalCount || 0}</h2>
                 <p className="text-[13px] text-gray-500 font-medium">Express yourself ✍️</p>
               </div>
               <div className="w-[52px] h-[52px] rounded-2xl bg-[#ffebf3] flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                 📝
               </div>
             </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-[#f3ebf9] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 delay-150">
             <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100/40 rounded-full blur-xl group-hover:bg-blue-200/50 transition-colors duration-700"></div>
             <div className="flex justify-between items-start relative z-10">
               <div>
                 <p className="text-gray-500 text-[13px] font-semibold uppercase tracking-wider mb-2">Meditation Mins</p>
                 <h2 className="text-4xl font-black text-[#56228e] mb-2">{stats.meditationMinutes}</h2>
                 <p className="text-[13px] text-gray-500 font-medium">Find your peace 🧘</p>
               </div>
               <div className="w-[52px] h-[52px] rounded-2xl bg-[#edf2fb] flex items-center justify-center text-2xl shadow-sm group-hover:-translate-y-2 transition-transform duration-500">
                 🧘
               </div>
             </div>
           </div>
        </div>

        {/* MIDDLE SECTION 2 COLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="relative rounded-3xl p-7 flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#e9f0ff] to-[#d8e0ff] border border-[#d6e2ff] group hover:shadow-lg transition-all duration-300 min-h-[160px] cursor-pointer">
              <div className="absolute -bottom-10 right-0 w-48 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBmaWxsPSIjYmRjYmZmIiBkPSJNMCAyMDBMMTAwIDEwMEwyMDAgMjAwWiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-bottom opacity-60 group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="relative z-10 w-3/4">
                <h2 className="text-xl font-extrabold text-[#385ca7] mb-2 tracking-tight group-hover:text-[#2d4d8e] transition-colors">Group Meditation</h2>
                <p className="text-sm text-[#5f7ebf] font-medium leading-relaxed mb-4">Join others in finding inner peace together</p>
                <div className="flex items-center gap-4 text-xs font-bold text-[#4568b2] tracking-wide relative">
                  <div className="flex -space-x-2">
                    {GROUP_MEDITATION_ICONS.map((icon,i)=>(<span key={i} className="w-7 h-7 rounded-full bg-white/70 shadow-sm border border-[#e9f0ff] flex items-center justify-center text-sm z-10 animate-float" style={{animationDelay:`${i*0.3}s`}}>{icon}</span>))}
                  </div>
                  + Community
                </div>
              </div>
           </div>

           <div className="relative rounded-3xl p-7 flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#eafff0] to-[#d4fce2] border border-[#c5f5d6] group hover:shadow-lg transition-all duration-300 min-h-[160px] cursor-pointer">
              <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjYjhlZmNjIiBkPSJNODEgNTlDODkgNTIgOTkgNDMgOTAgMjdDODIgMTMgNjQgNyA0OCAxNkMzMCAyNCAxNiA0NCAxOCA2MUMxOSA3NyAzNSA5MiA1MyA5MUM2OSA5MSA3NyA2NyA4MSA1OVoiLz48L3N2Zz4=')] bg-no-repeat bg-contain bg-center opacity-40 animate-pulse-slow"></div>
              <div className="relative z-10 w-3/4">
                <h2 className="text-xl font-extrabold text-[#1d7348] mb-2 tracking-tight group-hover:text-[#155a36] transition-colors">Clear Mind</h2>
                <p className="text-sm text-[#3b9f6b] font-medium leading-relaxed mb-4">Achieve mental clarity and focus</p>
                <div className="flex items-center gap-3 text-[#2a8757] font-bold text-xs tracking-wide">
                  <span className="text-base group-hover:animate-bounce">🧠</span>
                  <span className="text-base group-hover:scale-125 transition-transform delay-75">✨</span>
                  <span className="text-base group-hover:rotate-180 transition-transform duration-700 delay-150">🌟</span>
                  <span className="ml-1">Mental Clarity</span>
                </div>
              </div>
           </div>
        </div>

        {/* FIND YOUR INNER PEACE BANNER */}
        <div className="relative w-full rounded-[32px] p-10 md:p-14 text-center overflow-hidden bg-gradient-to-br from-[#f4f2ff] via-[#fdfbfd] to-[#f9f5fc] border border-[#efe9f9] shadow-[0_10px_30px_-15px_rgba(156,81,224,0.15)] group mt-4">
           {/* Geometry outlines */}
           <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 border-[1px] border-[#e7bcff]/30 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-[3s] ease-out"></div>
           <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 border-[1px] border-[#9c51e0]/10 rounded-[30%] pointer-events-none group-hover:rotate-90 transition-transform duration-[5s] ease-linear"></div>
           
           <h2 className="text-2xl md:text-3xl font-black text-[#6a1b9a] mb-2">Find Your Inner Peace</h2>
           <p className="text-[#a586c9] font-medium text-sm md:text-base max-w-lg mx-auto mb-10">Embrace tranquility and let serenity flow through your being</p>
           
           <div className="flex flex-wrap justify-center gap-8 md:gap-14">
              {PEACE_BANNERS.map((item, i) => (
               <div key={item.title} className="flex flex-col items-center gap-3 animate-float-slow" style={{animationDelay: `${i * 1.2}s`}}>
                 <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${item.bg} border ${item.border} flex items-center justify-center text-3xl md:text-4xl shadow-lg shadow-${item.bg.split('-')[1]}/30 hover:scale-125 hover:rotate-6 transition-all duration-300 cursor-pointer`}>
                   {item.icon}
                 </div>
                 <span className="text-[#7d5c9c] text-xs font-bold tracking-widest uppercase">{item.title}</span>
               </div>
             ))}
           </div>
        </div>

        {/* WELLNESS JOURNEY NAV CARDS */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] border border-[#f3ebf9]">
           <h2 className="text-2xl font-extrabold text-[#2a2a35] text-center mb-10 tracking-tight">Begin Your Wellness Journey</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {NAV_CARDS.map((btn, i) => (
               <Link key={btn.title} href={btn.link} className={`flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-br ${btn.from} ${btn.color} text-white shadow-xl ${btn.shadow} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group`}>
                 <div className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                   {btn.icon}
                 </div>
                 <h3 className="font-bold text-lg tracking-wide mb-1">{btn.title}</h3>
                 <p className="text-white/80 text-[11px] font-medium uppercase tracking-wider">{btn.sub}</p>
               </Link>
             ))}
           </div>
        </div>

        {/* DAILY INSPIRATION BOTTOM BAR */}
        <div className="bg-gradient-to-r from-[#fff9e6] to-[#fff3cd] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm border border-[#ffe4a0] hover:shadow-md transition-shadow group cursor-default gap-6">
           <div className="text-center md:text-left">
             <h3 className="font-extrabold text-[#b37012] mb-1.5 uppercase tracking-wider text-xs">Daily Inspiration</h3>
             <p className="text-[#8c5910]/80 italic text-[15px] font-medium group-hover:text-[#A76300] transition-colors duration-300">
               "Peace comes from within. Do not seek it without." - <span className="font-semibold text-[#8c5910]">Buddha</span>
             </p>
           </div>
           <div className="flex gap-3 text-2xl group-hover:scale-110 transition-transform duration-500">
              🌅 🙏
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}