"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import MoodChart from "@/components/MoodChart";
import { useGamification } from "@/components/GamificationProvider";

// Helper for dynamic colors
const getMoodConfig = (intensity: number) => {
  if (intensity <= 2) return { emoji: "😭", label: "Devastated", color: "from-blue-600 to-indigo-800", bg: "bg-blue-500", text: "text-blue-500", shadow: "shadow-blue-500/50" };
  if (intensity <= 4) return { emoji: "😔", label: "Struggling", color: "from-blue-400 to-slate-500", bg: "bg-slate-400", text: "text-slate-500", shadow: "shadow-slate-500/50" };
  if (intensity <= 6) return { emoji: "😐", label: "Okay", color: "from-yellow-400 to-orange-400", bg: "bg-yellow-400", text: "text-yellow-500", shadow: "shadow-yellow-500/50" };
  if (intensity <= 8) return { emoji: "🙂", label: "Good", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-400", text: "text-emerald-500", shadow: "shadow-emerald-500/50" };
  return { emoji: "🤩", label: "Amazing", color: "from-pink-400 to-rose-500", bg: "bg-pink-400", text: "text-pink-500", shadow: "shadow-pink-500/50" };
};

const commonTags = ["Work", "Sleep", "Health", "Social", "Exams", "Family", "Finances"];

export default function MoodPage() {
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [allMoods, setAllMoods] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak: 0, xp: 0, level: 1 });
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState("This Week");
  const [isFlipped, setIsFlipped] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [aiInsight, setAiInsight] = useState<{ observation: string; prediction: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);
  const router = useRouter();
  const { showXpGain } = useGamification();

  const tips = [
    "You do not have to be productive to be valuable. Rest is a requirement, not a reward.",
    "Progress is not linear. A frustrating day does not erase the solid work you’ve done.",
    "Speak to yourself today the exact way you would speak to someone you deeply love.",
    "It’s completely okay to pause right now and ask yourself what you genuinely need.",
    "Your boundaries are important. You are allowed to take up space and say no."
  ];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (isFlipped) {
      setTimeout(() => setTipIndex((prev) => (prev + 1) % tips.length), 300);
    }
  };

  const moodConfig = getMoodConfig(intensity);

  // Mock fetching past moods and AI insight
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch("/api/moods", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setAllMoods(data);
        }
      } catch (e) {}
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats({ streak: data.streak || 0, xp: data.xp || 0, level: data.level || 1 });
        }
      } catch(e) {}
    };

    const fetchInsight = async () => {
      try {
        const res = await fetch("/api/ai/mood");
        if (res.ok) {
          const data = await res.json();
          setAiInsight(data);
        }
      } catch (e) {
        console.error("Failed to load insight", e);
      } finally {
        setLoadingInsight(false);
      }
    };

    fetchMoods();
    fetchStats();
    fetchInsight();
  }, []);

  const getLevelTitle = (level: number) => {
    if (level < 5) return "Novice Searcher";
    if (level < 10) return "Emotional Explorer";
    if (level < 20) return "Mindful Master";
    return "Enlightened Being";
  };

  const nextLevelXp = stats.level * 100;
  const progressPct = Math.min(100, Math.max(0, (stats.xp / nextLevelXp) * 100));

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setNote((prev) => prev + "I had a really overwhelming day with multiple deadlines, but I pushed through.");
      setSelectedTags(Array.from(new Set([...selectedTags, "Work", "Exams"])));
      setIsRecording(false);
    }, 2500);
  };

  const saveMood = async () => {
    const finalNote = `${note} ${selectedTags.map(t => `#${t}`).join(" ")}`.trim();
    const res = await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: moodConfig.emoji, intensity, note: finalNote }),
    });

    if (res.ok) {
      const data = await res.json();
      
      // Update local mood list immediately
      setAllMoods(prev => [...prev, data.mood]);

      setNote("");
      setSelectedTags([]);
      setIntensity(5);
      
      // Update local streak and XP immediately for UI feedback
      const newXp = stats.xp + (data.xpGained || 50);
      let newLevel = stats.level;
      if (newXp >= nextLevelXp) newLevel++;
      
      setStats(prev => ({ ...prev, streak: prev.streak === 0 ? 1 : prev.streak, xp: newXp, level: newLevel }));
      
      showXpGain(data.xpGained || 50, `Mood saved successfully! Streak active!`, data.leveledUp);
      
      // Fetch latest from API to ensure accurate DB state
      fetch("/api/user/analytics").then(res => res.json()).then(newData => setStats(s => ({...s, streak: newData.streak, xp: newData.xp, level: newData.level})));
      
      router.refresh();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-12">
        
        {/* GAMIFICATION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-3xl p-6 shadow-sm border border-gray-100 gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/30">
              <span className="animate-bounce">🔥</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Current Streak</p>
              <h2 className="text-3xl font-black text-gray-800">{stats.streak} Days</h2>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md bg-gray-50 rounded-2xl p-4 border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl group-hover:bg-purple-300/50 transition-colors"></div>
            <div className="flex justify-between items-end mb-2 relative z-10">
              <div>
                <span className="text-xs font-bold text-purple-500 bg-purple-100 px-2 py-1 rounded-lg">Level {stats.level}</span>
                <p className="text-xs font-semibold text-gray-500 mt-1">{getLevelTitle(stats.level)}</p>
              </div>
              <span className="text-sm font-bold text-gray-700">{stats.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 relative z-10">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT: SMART INPUT & AI INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SMART INPUT */}
          <div className={`lg:col-span-7 rounded-[32px] p-1 shadow-2xl transition-all duration-700 bg-gradient-to-br ${moodConfig.color}`}>
            <div className="bg-white/95 backdrop-blur-xl w-full h-full rounded-[30px] p-5 md:p-6 flex flex-col items-center">
              
              <h2 className={`text-2xl font-black mb-4 transition-colors duration-500 ${moodConfig.text}`}>
                How are you feeling?
              </h2>

              {/* Dynamic Emoji visualizer */}
              <div className="relative group cursor-pointer mb-6 flex flex-col items-center">
                <div className={`absolute inset-0 bg-gradient-to-tr ${moodConfig.color} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>
                <div className="text-[80px] leading-none transform group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300 relative z-10 drop-shadow-2xl select-none mb-2 mt-0">
                  {moodConfig.emoji}
                </div>
                <div className={`px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest ${moodConfig.bg} shadow-lg whitespace-nowrap relative z-10`}>
                  {moodConfig.label}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="w-full max-w-sm mb-6">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest px-1">
                  <span>Awful</span>
                  <span>Neutral</span>
                  <span>Amazing</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none bg-gray-100 cursor-pointer shadow-inner relative"
                  style={{
                    background: `linear-gradient(to right, ${intensity <= 4 ? '#ef4444' : intensity <= 6 ? '#f59e0b' : '#3b82f6'} ${((intensity - 1) / 9) * 100}%, #f3f4f6 ${((intensity - 1) / 9) * 100}%)`
                  }}
                />
              </div>

              {/* Quick Tags */}
              <div className="w-full mb-4">
                <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Quick Tags</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedTags.includes(tag) 
                          ? `${moodConfig.bg} text-white shadow-md transform scale-105` 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Voice Input */}
              <div className="w-full relative mb-5">
                <textarea
                  placeholder="What's making you feel this way? Or tap the mic..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 pr-12 min-h-[100px] focus:outline-none focus:border-purple-300 focus:bg-white transition-all resize-none text-gray-700 font-medium text-sm"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button 
                  onClick={simulateVoiceInput}
                  disabled={isRecording}
                  className={`absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                    isRecording 
                      ? "bg-red-500 text-white animate-pulse shadow-red-500/50" 
                      : "bg-white text-purple-500 border border-purple-100 hover:bg-purple-50"
                  }`}
                >
                  {isRecording ? (
                    <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                  ) : "🎙️"}
                </button>
              </div>

              <button
                onClick={saveMood}
                className={`w-full py-3 rounded-2xl font-black text-white text-[15px] tracking-wide uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${moodConfig.bg} ${moodConfig.shadow}`}
              >
                Log Mood
              </button>
            </div>
          </div>

          {/* RIGHT: AI & SUPPORT */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* AI Insight */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[32px] p-8 text-white shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] relative overflow-hidden group min-h-[220px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="text-3xl animate-spin-slow inline-block">🔮</span>
                <h3 className="font-black text-xl tracking-tight text-white">Mind AI Insight</h3>
              </div>
              <div className="space-y-4 relative z-10 w-full h-full flex flex-col justify-center">
                
                {loadingInsight ? (
                  <div className="w-full flex flex-col items-center justify-center py-4 opacity-70">
                    <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-semibold tracking-widest uppercase animate-pulse">Scanning DB Vault...</p>
                  </div>
                ) : aiInsight ? (
                  <>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                        {aiInsight.observation}
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30">
                      <p className="text-sm text-emerald-100 font-medium leading-relaxed flex gap-2">
                        <span>✨</span> {aiInsight.prediction}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
                    <p className="text-sm text-indigo-200">Unable to generate insight at this time.</p>
                  </div>
                )}
                
              </div>
            </div>

            {/* Unique Interactive Mental Health Tip */}
            <div 
              className="relative w-full h-[240px] perspective-1000 cursor-pointer group"
              onClick={handleFlip}
            >
              <div className={`w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front of the Card: The Prompt */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[32px] p-8 text-white shadow-xl flex flex-col items-center justify-center border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                  
                  {/* Rotating rings effect */}
                  <div className="absolute w-[180px] h-[180px] rounded-full border border-purple-500/30 animate-[spin_10s_linear_infinite] pointer-events-none"></div>
                  <div className="absolute w-[140px] h-[140px] rounded-full border border-pink-500/30 animate-[spin_8s_linear_infinite_reverse] pointer-events-none"></div>

                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl animate-pulse">✨</span>
                  </div>
                  <h3 className="font-black text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                    Tap to Reveal
                  </h3>
                  <p className="text-xs font-semibold text-purple-300/70 mt-2 uppercase tracking-[0.2em]">
                    Daily Mind Insight
                  </p>
                </div>

                {/* Back of the Card: The Tip */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center justify-center border border-gray-100 text-center">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                  
                  <span className="text-4xl mb-4 group-hover:-translate-y-2 transition-transform duration-300">💡</span>
                  <p className="text-sm font-bold text-gray-700 leading-relaxed max-w-[240px] relative z-10 italic">
                    "{tips[tipIndex]}"
                  </p>
                  
                  <div className="absolute bottom-4 text-[9px] font-black uppercase text-gray-300 tracking-widest">
                    Tap to close
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* DATA VISUALIZATION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-800 text-xl tracking-tight">Emotional Trend</h3>
              <select 
                value={chartTimeframe}
                onChange={(e) => setChartTimeframe(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
            {/* The existing chart component wrapped beautifully */}
            <div className="h-[280px] w-full">
              <MoodChart 
                moods={chartTimeframe === "This Week" ? allMoods.slice(-7) : allMoods} 
                title={chartTimeframe === "This Week" ? "Last 7 Moods" : "Last 30 Moods"} 
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-extrabold text-gray-800 text-xl tracking-tight mb-6 flex items-center gap-2">
              📜 Recent Logs
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[400px]">
              {allMoods.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium text-center italic mt-10">No recent logs. Start tracking!</p>
              ) : (
                (showAllHistory ? [...allMoods].reverse() : [...allMoods].reverse().slice(0, 3)).map((m: any) => (
                  <div key={m.id} className="relative bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f3ebf9] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(156,81,224,0.08)] transition-all duration-300 group">
                    
                    {/* Intensity Indicator Strip */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-14 rounded-r-full" style={{ background: `linear-gradient(to bottom, ${m.intensity <= 4 ? '#ef4444' : m.intensity <= 6 ? '#f59e0b' : '#3b82f6'}, transparent)` }}></div>
                    
                    <div className="flex justify-between items-start mb-4 pl-3">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fcf9ff] to-[#f3ebf9] border border-white flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                           {m.mood}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-gray-800 text-[15px] flex items-center gap-2">
                             Intensity: {m.intensity}<span className="text-gray-400 text-xs font-bold">/ 10</span>
                          </span>
                          <span className="text-[10px] font-black text-[#9c51e0] uppercase tracking-widest bg-purple-50/80 px-2.5 py-1 rounded-lg w-max border border-purple-100/50">
                            {new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(m.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pl-3">
                       {m.note ? (
                         <div className="relative">
                           <div className="absolute top-0 left-0 text-3xl text-gray-200/50 -translate-x-2 -translate-y-2 pointer-events-none font-serif">"</div>
                           <p className="text-[13px] text-gray-600 font-semibold leading-relaxed bg-[#fdfbfd] p-3.5 rounded-2xl border border-[#f3ebf9]/80 shadow-sm relative z-10">
                             {m.note}
                           </p>
                         </div>
                       ) : (
                         <p className="text-[13px] text-gray-400 italic font-medium bg-gray-50/50 p-2 rounded-xl text-center">No notes provided for this log.</p>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {allMoods.length > 3 && (
              <button 
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="w-full mt-4 pt-4 border-t border-gray-100 text-purple-600 font-bold text-sm hover:text-purple-700 transition-colors uppercase tracking-widest"
              >
                {showAllHistory ? "Show Less" : "View All History"}
              </button>
            )}
          </div>

        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </DashboardLayout>
  );
}
