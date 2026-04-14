"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useGamification } from "@/components/GamificationProvider";

const THEMES = {
  default: { id: "default", name: "Minimal", bg: "bg-white", text: "text-gray-800", border: "border-gray-100", shadow: "shadow-sm", accent: "bg-purple-500", icon: "✨" },
  rainy: { id: "rainy", name: "Rainy", bg: "bg-[#1E293B]", text: "text-blue-100", border: "border-blue-900", shadow: "shadow-blue-900/50", accent: "bg-blue-500", icon: "🌧️" },
  sunshine: { id: "sunshine", name: "Sunshine", bg: "bg-[#FFFbeb]", text: "text-amber-900", border: "border-amber-200", shadow: "shadow-amber-200/50", accent: "bg-amber-500", icon: "☀️" },
  deep: { id: "deep", name: "Deep Focus", bg: "bg-[#0F172A]", text: "text-purple-100", border: "border-purple-900", shadow: "shadow-purple-900/50", accent: "bg-purple-600", icon: "🌌" }
};

const TEMPLATES = [
  { name: "Gratitude", text: "Today, I am grateful for...\n1.\n2.\n3.\n\nSomething that made me smile was..." },
  { name: "Stress Dump", text: "Right now, I am feeling overwhelmed by...\n\nIf I could let go of one thing, it would be...\n\nA small step I can take to feel better is..." },
  { name: "Daily Reflection", text: "The best part of my day was...\n\nA challenge I faced today was...\n\nTomorrow, I want to focus on..." }
];

export default function JournalPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(THEMES.default);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);
  const [sentiment, setSentiment] = useState({ score: 50, label: "Writing...", emoji: "💭" });
  const [entries, setEntries] = useState<any[]>([]);
  const [stats, setStats] = useState({ journalStreak: 0, level: 1 });
  const router = useRouter();
  const { showXpGain } = useGamification();
  
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-analyze sentiment dynamically based on content length
  useEffect(() => {
    if (content.length === 0) {
      setSentiment({ score: 50, label: "Empty", emoji: "💭" });
      return;
    }
    const sadWords = ["sad", "depressed", "struggling", "hard", "crying", "bad", "pain", "anxious", "stress", "overwhelmed"];
    const happyWords = ["happy", "great", "smile", "love", "amazing", "grateful", "excited", "good", "win"];
    
    let score = 50;
    const lower = content.toLowerCase();
    sadWords.forEach(w => { if(lower.includes(w)) score -= 15; });
    happyWords.forEach(w => { if(lower.includes(w)) score += 15; });
    
    score = Math.max(10, Math.min(90, score)); // clamp 10-90
    
    if (score < 40) setSentiment({ score, label: "Reflective / Heavy", emoji: "🌧️" });
    else if (score > 60) setSentiment({ score, label: "Positive / Joyful", emoji: "☀️" });
    else setSentiment({ score, label: "Balanced / Neutral", emoji: "⚖️" });
  }, [content]);

  // Fetch recent journals and AI suggestion
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch("/api/journal", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (e) {}
    };

    const fetchSuggestion = async () => {
      try {
        const res = await fetch("/api/ai/journal");
        if (res.ok) {
          const data = await res.json();
          setAiSuggestion(data.suggestion);
        }
      } catch (e) {
        console.error("AI Suggestion error", e);
      } finally {
        setLoadingSuggestion(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats({ journalStreak: data.journalStreak || 0, level: data.level || 1 });
        }
      } catch (e) {}
    };

    fetchJournals();
    fetchSuggestion();
    fetchStats();
  }, []);

  // Check pin status & session unlock
  useEffect(() => {
    // The vault now locks every single time you navigate to this tab.
    // sessionStorage persistence has been removed for maximum privacy.
    
    const checkPinStatus = async () => {
      try {
        const res = await fetch("/api/journal/pin");
        if (res.ok) {
          const data = await res.json();
          setHasPin(data.hasPin);
        } else {
          setHasPin(false);
        }
      } catch (err) {
        setHasPin(false);
      }
    };
    checkPinStatus();
  }, []);

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setContent(prev => prev + (prev ? " " : "") + "Adding this from voice transcription. I'm feeling really hopeful about my goals today.");
      setIsRecording(false);
    }, 2500);
  };

  const expandThoughtsAI = async () => {
    if (!content) return;
    setIsExpanding(true);
    try {
      const res = await fetch("/api/ai/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "expand", content })
      });
      if (res.ok) {
        const data = await res.json();
        setContent(prev => prev + `\n\n[Mind AI Expansion]: ${data.result}\n\n`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExpanding(false);
    }
  };

  const summarizeAI = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/ai/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summarize", content })
      });
      if (res.ok) {
        const data = await res.json();
        setContent(prev => prev + `\n\n[Mind AI Summary]:\n${data.result}\n\n`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const saveEntry = async () => {
    if (!content) return;
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, sentimentScore: sentiment.score }),
    });
    if (res.ok) {
      const data = await res.json();
      
      // Update local timeline instantly to show new record
      setEntries(prev => [data.entry, ...prev]);
      
      showXpGain(data.xpGained || 20, "Excellent! Journal saved securely.", data.leveledUp);
      setTitle("");
      setContent("");
      
      // Update streaks in background passively
      try {
        const statsRes = await fetch("/api/user/analytics");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({ journalStreak: statsData.journalStreak || 0, level: statsData.level || 1 });
        }
      } catch (e) {}

      router.refresh();
    }
  };

  // Privacy Lock Screen
  if (isLocked) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 max-w-md mx-auto">
          <div className="bg-white p-10 rounded-[32px] shadow-xl border border-gray-100 text-center w-full relative">
            {isCheckingPin && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[32px] z-10 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <div className={`w-20 h-20 ${pinError ? 'bg-red-100 text-red-500' : 'bg-purple-100 text-purple-600'} rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner transition-colors`}>{pinError ? '❌' : '🔒'}</div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Private Journal</h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">
              {hasPin === null ? "Loading secure vault..." 
                : hasPin ? "Your thoughts are securely encrypted. Enter PIN to unlock your vault." 
                : "Welcome to the vault! Create a safe 4-digit PIN."}
            </p>
            <input 
              type="password" 
              maxLength={4}
              placeholder="••••"
              disabled={hasPin === null || isCheckingPin}
              className={`tracking-[1em] text-center text-2xl font-black w-full bg-gray-50 border-2 p-4 rounded-2xl focus:outline-none transition-colors mb-2 ${pinError ? 'border-red-500 focus:border-red-500 animate-shake' : 'border-gray-200 focus:border-purple-500'}`}
              value={pin}
              onChange={async (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setPin(val);
                setPinError(false);
                
                if (val.length === 4 && hasPin !== null) {
                  setIsCheckingPin(true);
                  if (hasPin) { // Verify
                    const res = await fetch("/api/journal/pin", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ pin: val })
                    });
                    if (res.ok) {
                      setTimeout(() => setIsLocked(false), 200);
                    } else {
                      setPinError(true);
                      setPin("");
                    }
                  } else { // Create
                    const res = await fetch("/api/journal/pin", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ pin: val })
                    });
                    if (res.ok) {
                      setHasPin(true);
                      setTimeout(() => setIsLocked(false), 200);
                    } else {
                      setPinError(true);
                      setPin("");
                    }
                  }
                  setIsCheckingPin(false);
                }
              }}
            />
          </div>
        </div>
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
          }
        `}</style>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`transition-all duration-700 ${isFocusMode ? "fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-xl overflow-y-auto flex pt-10 md:pt-20 pb-10 justify-center px-4 md:px-12 animate-in fade-in" : "max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in"}`}>
        
        {/* HEADER & GAMIFICATION */}
        {!isFocusMode && (
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                Mind Sanctuary <span className="text-xl">✍️</span>
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">A safe, intelligent space for your thoughts.</p>
            </div>
            
            <div className="flex gap-4 w-full lg:w-auto">
              {/* Streaks */}
              <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 flex-1 lg:flex-none">
                <span className="text-2xl animate-pulse">🔥</span>
                <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Writing Streak</p>
                  <p className="text-lg font-black text-orange-600">{stats.journalStreak} Days</p>
                </div>
              </div>
              {/* Level */}
              </div>
              
              <button 
                onClick={() => setIsLocked(true)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-2xl border border-gray-200 transition-colors group ml-2"
                title="Lock Vault Now"
              >
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Lock Vault</span>
                <span className="text-xl">🔒</span>
              </button>
            </div>
        )}

        {/* MAIN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className={`lg:col-span-3 transition-colors duration-1000 ${selectedTheme.bg} ${selectedTheme.border} border rounded-[32px] shadow-xl overflow-hidden relative flex flex-col ${isFocusMode ? 'min-h-[85vh] w-[75vw] max-w-6xl mx-auto' : 'min-h-[600px]'}`}>
            
            {/* Dynamic Ambient Background blob */}
            <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none ${selectedTheme.accent} animate-pulse-slow`}></div>

            {/* Editor Toolbar */}
            <div className={`flex flex-wrap justify-between items-center p-4 border-b ${selectedTheme.border} bg-white/5 backdrop-blur-md relative z-10 gap-4`}>
              
              <div className="flex gap-2">
                {Object.values(THEMES).map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setSelectedTheme(t)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110 ${selectedTheme.id === t.id ? 'ring-2 ring-white/50 scale-110 shadow-lg' : 'opacity-60 grayscale hover:grayscale-0'}`}
                    title={t.name}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <select 
                  className="bg-transparent text-sm font-bold opacity-80 cursor-pointer focus:outline-none"
                  onChange={(e) => setContent(e.target.value)}
                >
                  <option value="">✨ Templates</option>
                  {TEMPLATES.map(t => (
                    <option key={t.name} value={t.text}>{t.name}</option>
                  ))}
                </select>

                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors border border-white/10"
                >
                  {isFocusMode ? "Exit Focus ↙" : "Focus Mode ↗"}
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className={`flex-1 flex flex-col p-6 md:p-10 relative z-10 ${selectedTheme.text}`}>
              <input 
                type="text" 
                placeholder="Title your entry (Optional)"
                className="w-full bg-transparent text-2xl md:text-4xl font-black tracking-tight border-none focus:outline-none mb-6 placeholder:opacity-30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <textarea 
                ref={editorRef}
                placeholder="Start writing... The AI will analyze your tone as you type."
                className="w-full flex-1 bg-transparent text-lg leading-relaxed border-none focus:outline-none resize-none placeholder:opacity-30 custom-scrollbar"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {/* Bottom Editor Bar */}
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
                
                {/* Sentiment Meter */}
                <div className="flex items-center gap-4 w-full md:w-auto bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <span className="text-2xl">{sentiment.emoji}</span>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold uppercase tracking-widest opacity-60">Live Tone</span>
                     <span className="text-sm font-semibold">{sentiment.label}</span>
                  </div>
                  <div className="w-24 h-1.5 ml-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" style={{ width: `${sentiment.score}%`, transition: 'width 1s ease-in-out' }}></div>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={simulateVoiceInput}
                    disabled={isRecording}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
                  >
                    {isRecording ? <span className="w-4 h-4 rounded-full bg-white animate-ping"></span> : "🎙️"}
                  </button>

                  <button 
                    onClick={saveEntry}
                    className={`px-8 py-3 rounded-2xl font-black text-white ${selectedTheme.id === 'default' ? 'bg-purple-600' : 'bg-white/20 hover:bg-white/30'} shadow-lg border border-white/10 transition-transform hover:scale-105 active:scale-95`}
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (AI & History) */}
          {!isFocusMode && (
            <div className="lg:col-span-1 space-y-6">
              
              {/* AI Assistant Panel */}
              <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                 <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2 tracking-tight">
                   <span className="animate-spin-slow">🤖</span> Mind AI
                 </h3>
                 
                 <div className="space-y-3">
                   <button 
                     onClick={expandThoughtsAI}
                     disabled={isExpanding || !content}
                     className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 text-left cursor-pointer"
                   >
                     <span className="text-sm font-semibold flex items-center gap-2">
                       {isExpanding ? <span className="w-3 h-3 rounded-full bg-white animate-ping"></span> : "✨"} Expand Thoughts
                     </span>
                     <span className="text-xs opacity-50">AI</span>
                   </button>
                   <button 
                     onClick={summarizeAI}
                     disabled={isSummarizing || !content}
                     className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 text-left cursor-pointer"
                   >
                     <span className="text-sm font-semibold flex items-center gap-2">
                       {isSummarizing ? <span className="w-3 h-3 rounded-full bg-white animate-ping"></span> : "📝"} Auto-Summarize
                     </span>
                     <span className="text-xs opacity-50">AI</span>
                   </button>
                 </div>

                 <div className="mt-8 pt-6 border-t border-white/10">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Daily Prompt</p>
                   {loadingSuggestion ? (
                     <div className="flex justify-center p-4">
                       <span className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                     </div>
                   ) : aiSuggestion ? (
                     <p className="text-sm font-medium text-emerald-200 leading-relaxed bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 italic">
                       "{aiSuggestion}"
                     </p>
                   ) : (
                     <p className="text-sm font-medium text-gray-400">Vault unavailable right now.</p>
                   )}
                 </div>
              </div>

              {/* Timeline mini-view */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 h-[400px] flex flex-col">
                <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2 tracking-tight">
                  🕰️ Timeline
                </h3>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                   {entries.length === 0 ? (
                     <p className="text-gray-400 text-sm font-medium text-center italic mt-10">Vault is empty.</p>
                   ) : (
                     entries.map((e: any) => (
                       <div key={e.id} className="relative pl-6 border-l-2 border-purple-100 pb-4 group cursor-pointer hover:border-purple-400 transition-colors">
                         <div className="absolute w-3 h-3 bg-white border-2 border-purple-400 rounded-full -left-[7px] top-1 group-hover:scale-150 group-hover:bg-purple-400 transition-all"></div>
                         <h4 className="text-sm font-bold text-gray-800 truncate">{e.title || "Untitled Entry"}</h4>
                         <p className="text-xs text-gray-400 font-medium mb-1">{new Date(e.date).toLocaleDateString()} • {e.sentimentScore > 60 ? '☀️' : e.sentimentScore < 40 ? '🌧️' : '⚖️'}</p>
                         <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-gray-50 p-2 rounded-xl mt-2">{e.content}</p>
                       </div>
                     ))
                   )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.3); }
      `}</style>
    </DashboardLayout>
  );
}
