"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGamification } from "@/components/GamificationProvider";

const ENVIRONMENTS = [
  { id: "space", name: "Deep Space", bg: "from-slate-900 via-purple-900 to-slate-900", text: "text-purple-100", icon: "🌌", accent: "bg-purple-500" },
  { id: "forest", name: "Pine Forest", bg: "from-emerald-900 via-green-800 to-teal-900", text: "text-green-100", icon: "🌲", accent: "bg-emerald-500" },
  { id: "ocean", name: "Ocean Waves", bg: "from-blue-900 via-cyan-900 to-blue-900", text: "text-cyan-100", icon: "🌊", accent: "bg-cyan-500" },
  { id: "rain", name: "Soft Rain", bg: "from-gray-800 via-slate-800 to-gray-900", text: "text-gray-100", icon: "🌧️", accent: "bg-slate-500" }
];

const CATEGORIES = [
  { name: "Stress Relief", duration: "5 min", icon: "🧘‍♀️" },
  { name: "Deep Sleep", duration: "20 min", icon: "😴" },
  { name: "Focus & Flow", duration: "10 min", icon: "🧠" },
  { name: "Anxiety SOS", duration: "3 min", icon: "🆘" }
];

const FEEDBACK_EMOJIS = ["😴", "😌", "🙂", "🤩"];
const JOURNEY_STEPS = [1, 2, 3];
const MIXER_TRACKS = [
  { key: "voice", name: "Voice Guide", col: "accent-purple-500", textCol: "text-purple-600", bgCol: "bg-purple-100" },
  { key: "env", name: "Environment", col: "accent-blue-500", textCol: "text-blue-600", bgCol: "bg-blue-100" },
  { key: "binaural", name: "Binaural Beats", col: "accent-emerald-500", textCol: "text-emerald-600", bgCol: "bg-emerald-100" }
];

export default function MeditationPage() {
  const [env, setEnv] = useState(ENVIRONMENTS[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [timer, setTimer] = useState(0);
  const [breathingScale, setBreathingScale] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("Unwind & Breathe");
  
  const [breathingMode, setBreathingMode] = useState("Box Breathing (4-4-4-4)");

  // Audio Mixer State
  const [volumes, setVolumes] = useState({ voice: 80, env: 0, binaural: 0 });
  const envAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const binauralGainRef = useRef<GainNode | null>(null);
  const [stats, setStats] = useState({ meditationMinutes: 0, meditationStreak: 0, meditationCount: 0 });
  const [journey, setJourney] = useState<any[]>([]);
  const [aiCoach, setAiCoach] = useState<{ insight: string; technique: string } | null>(null);
  const [loadingCoach, setLoadingCoach] = useState(true);
  const { showXpGain } = useGamification();

  const fetchData = async () => {
    try {
      // Fetch Stats
      const statsRes = await fetch("/api/user/analytics");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({ 
          meditationMinutes: data.meditationMinutes || 0, 
          meditationStreak: data.meditationStreak || 0, 
          meditationCount: data.meditationCount || 0 
        });
      }

      // Fetch Journey
      const journeyRes = await fetch("/api/meditation");
      if (journeyRes.ok) {
        const data = await journeyRes.json();
        setJourney(data);
      }

      // Fetch AI Coach
      const coachRes = await fetch("/api/ai/meditation");
      if (coachRes.ok) {
        const data = await coachRes.json();
        setAiCoach(data);
      }
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoadingCoach(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync volumes dynamically
  useEffect(() => {
    if (envAudioRef.current) envAudioRef.current.volume = volumes.env / 100;
    if (binauralGainRef.current && audioCtxRef.current) {
      binauralGainRef.current.gain.setTargetAtTime((volumes.binaural / 100) * 0.5, audioCtxRef.current.currentTime || 0, 0.1);
    }
  }, [volumes]);

  // Handle active audio elements via browser APIs
  useEffect(() => {
    if (isActive) {
      if (volumes.env > 0) envAudioRef.current?.play().catch(console.error);
      else envAudioRef.current?.pause();

      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        
        const masterGain = ctx.createGain();
        masterGain.gain.value = (volumes.binaural / 100) * 0.5;
        masterGain.connect(ctx.destination);
        binauralGainRef.current = masterGain;

        const baseFreq = 200; 
        const beatFreq = 8;   

        const leftOsc = ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.value = baseFreq;
        const leftPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (leftPanner) leftPanner.pan.value = -1;

        const rightOsc = ctx.createOscillator();
        rightOsc.type = 'sine';
        rightOsc.frequency.value = baseFreq + beatFreq;
        const rightPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (rightPanner) rightPanner.pan.value = 1;

        if (leftPanner && rightPanner) {
          leftOsc.connect(leftPanner).connect(masterGain);
          rightOsc.connect(rightPanner).connect(masterGain);
        } else {
          leftOsc.connect(masterGain);
          rightOsc.connect(masterGain);
        }

        leftOsc.start();
        rightOsc.start();
      } else {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      }
    } else {
      envAudioRef.current?.pause();
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      if (typeof window !== "undefined") window.speechSynthesis.cancel();
    }
  }, [isActive, volumes.env]);

  const speak = (text: string) => {
    if (!isActive) return;
    if (volumes.voice > 0 && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volumes.voice / 100;
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Breathing Engine Cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let cycleTimeout1: NodeJS.Timeout;
    let cycleTimeout2: NodeJS.Timeout;
    let cycleTimeout3: NodeJS.Timeout;
    let mainLoop: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);

      const runBreathingCycle = () => {
        if (!isActive) return;
        setPhase("Inhale...");
        speak("Inhale...");
        setBreathingScale(1.8);
        
        if (breathingMode.includes("4-4-4-4")) {
          cycleTimeout1 = setTimeout(() => {
            if (!isActive) return;
            setPhase("Hold...");
            speak("Hold...");
            
            cycleTimeout2 = setTimeout(() => {
              if (!isActive) return;
              setPhase("Exhale...");
              speak("Exhale...");
              setBreathingScale(1);
              
              cycleTimeout3 = setTimeout(() => {
                if (!isActive) return;
                setPhase("Hold...");
                speak("Hold...");
              }, 4000);
            }, 4000);
          }, 4000);
        } else if (breathingMode.includes("4-7-8")) {
          cycleTimeout1 = setTimeout(() => {
            if (!isActive) return;
            setPhase("Hold...");
            speak("Hold...");
            
            cycleTimeout2 = setTimeout(() => {
              if (!isActive) return;
              setPhase("Exhale...");
              speak("Exhale...");
              setBreathingScale(1);
            }, 7000);
          }, 4000);
        } else if (breathingMode.includes("6-2")) {
          cycleTimeout1 = setTimeout(() => {
            if (!isActive) return;
            setPhase("Exhale...");
            speak("Exhale...");
            setBreathingScale(1);
          }, 6000);
        }
      };

      runBreathingCycle(); 
      let loopDuration = 16000;
      if (breathingMode.includes("4-7-8")) loopDuration = 19000;
      else if (breathingMode.includes("6-2")) loopDuration = 8000;

      mainLoop = setInterval(runBreathingCycle, loopDuration);
    }

    return () => {
      clearInterval(interval);
      clearInterval(mainLoop);
      clearTimeout(cycleTimeout1);
      clearTimeout(cycleTimeout2);
      clearTimeout(cycleTimeout3);
    };
  }, [isActive, breathingMode]);

  const startSession = (title?: string) => {
    if (title && title !== "Box Breathing" && !title.includes("Session")) {
      setSessionTitle(title);
    } else {
      setSessionTitle(breathingMode);
    }
    setIsActive(true);
  };

  const stopMeditation = () => {
    setIsActive(false);
    setBreathingScale(1);
    setPhase("Ready");
    if (timer > 10) {
      setShowFeedback(true);
    } else {
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const saveSession = async () => {
    setShowFeedback(false);
    const durationMinutes = Math.ceil(timer / 60) || 1;
    
    try {
      const res = await fetch("/api/meditation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes })
      });

      if (res.ok) {
        const data = await res.json();
        showXpGain(data.xpGained, `Mindfulness achieved! +${data.xpGained} XP earned.`, data.leveledUp);
        fetchData(); // Refresh all data
      }
    } catch (e) {
      console.error("Failed to save session", e);
    }
    
    setTimer(0);
  };

  let transitionStyle = '200ms';
  if (phase.includes("Inhale")) {
    transitionStyle = breathingMode.includes("6-2") ? '6000ms' : '4000ms';
  } else if (phase.includes("Exhale")) {
    if (breathingMode.includes("4-7-8")) transitionStyle = '8000ms';
    else if (breathingMode.includes("6-2")) transitionStyle = '2000ms';
    else transitionStyle = '4000ms';
  }

  return (
    <DashboardLayout>
      <audio ref={envAudioRef} src="https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" loop />
      
      {/* IMMERSIVE MODE OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] bg-gradient-to-br ${env.bg} flex flex-col items-center justify-center transition-all duration-1000 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30 ${env.accent} animate-float-slow`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-20 ${env.accent} animate-pulse-slow`}></div>
        
        <button 
          onClick={stopMeditation}
          className="absolute top-10 right-10 text-white/50 hover:text-white text-sm font-bold tracking-widest uppercase transition-colors"
        >
          End Session ×
        </button>

        <div className="text-center z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{sessionTitle}</h1>
          <p className="text-white/60 font-medium mb-12 tracking-widest uppercase text-sm">{env.name} Soundscape</p>
          
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-16 mt-8">
             <div 
               className={`absolute w-40 h-40 rounded-full border-4 border-white/20 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] z-20`}
               style={{ 
                 transform: `scale(${isActive ? breathingScale : 1})`, 
                 transitionDuration: transitionStyle,
                 transitionTimingFunction: 'ease-in-out'
               }}
             ></div>
             <div 
               className={`absolute w-32 h-32 rounded-full ${env.accent} opacity-50 blur-xl transition-all z-10`}
               style={{ 
                 transform: `scale(${isActive ? breathingScale * 1.2 : 1})`, 
                 transitionDuration: transitionStyle 
               }}
             ></div>
             <h2 className={`text-4xl font-black text-white z-30 transition-opacity drop-shadow-lg ${phase.includes("Hold") ? 'opacity-80' : 'opacity-100'}`}>
               {isActive ? phase : ""}
             </h2>
          </div>

          <div className="text-white/80 font-mono text-xl bg-white/10 px-6 py-2 rounded-full backdrop-blur-md inline-block">
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="fixed inset-0 z-[110] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-10 shadow-2xl max-w-md w-full text-center slide-in-from-bottom-8">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">✨</div>
             <h2 className="text-2xl font-black text-gray-800 mb-2">Session Complete</h2>
             <p className="text-gray-500 font-medium mb-8">You meditated for <span className="font-bold text-gray-800">{formatTime(timer)}</span>. How do you feel now?</p>
             <div className="flex justify-center gap-4 mb-8">
               {FEEDBACK_EMOJIS.map(emoji => (
                 <button key={emoji} onClick={saveSession} className="w-14 h-14 rounded-full bg-gray-50 hover:bg-purple-50 hover:scale-110 text-3xl transition-transform border border-gray-100 shadow-sm">
                   {emoji}
                 </button>
               ))}
             </div>
             <button onClick={saveSession} className="text-sm font-bold text-gray-400 hover:text-gray-600">Skip</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              Sanctuary <span className="text-xl">🧘</span>
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Pause, breathe, and reconnect with yourself.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Total Minutes</p>
                <p className="text-lg font-black text-blue-600">{stats.meditationMinutes} mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 px-5 py-2.5 rounded-2xl border border-orange-100">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Current Streak</p>
                <p className="text-lg font-black text-orange-600">{stats.meditationStreak} Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP SPLIT: Active Session vs Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Session & Milestones */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            <div className={`relative flex-1 min-h-[400px] rounded-[32px] overflow-hidden bg-gradient-to-br ${env.bg} p-10 flex flex-col justify-between shadow-lg group transition-colors duration-1000`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-40 ${env.accent} animate-pulse-slow pointer-events-none`}></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  <p className={`text-sm font-bold tracking-widest uppercase ${env.text} flex items-center gap-2`}>
                    {env.icon} {env.name}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/80 transition-colors">
                  ⚙️
                </button>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center mt-4">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-md">Unwind & Breathe</h2>
                <p className="text-white/70 font-medium text-lg mb-10">{breathingMode} Technique</p>
                <button 
                  onClick={() => startSession()}
                  className="px-10 py-5 bg-white text-gray-900 rounded-full font-black text-xl shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Start Session
                </button>
              </div>
            </div>

            {/* Achievements under session to fill out the wide space beautifully */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[32px] p-6 shadow-sm border border-orange-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-orange-900 text-lg mb-1">Weekly Milestones</h3>
                <p className="text-sm text-orange-700 font-medium">Keep up your streak to unlock achievements!</p>
              </div>
              <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl shadow-inner">🏆</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Zen Master</h4>
                  <p className="text-xs text-orange-600 font-medium mt-1">Meditate 5 times ({stats.meditationCount}/5)</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Soundscapes, Mixer, Breathing Mode */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4">Soundscapes</h3>
              <div className="grid grid-cols-2 gap-4">
                {ENVIRONMENTS.map(e => (
                  <button 
                    key={e.id}
                    onClick={() => setEnv(e)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${env.id === e.id ? 'bg-gray-50 border-purple-300 shadow-sm scale-105' : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
                  >
                    <span className="text-2xl">{e.icon}</span>
                    <span className="text-xs font-bold text-gray-600 truncate">{e.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4 flex items-center gap-2">🎛️ Audio Mixer</h3>
              <div className="space-y-6">
                {MIXER_TRACKS.map(track => (
                  <div key={track.key} className="flex flex-col gap-2 group">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{track.name}</span>
                      <span className={`text-[10px] font-black ${track.textCol} ${track.bgCol} px-2 py-0.5 rounded-md`}>
                        {volumes[track.key as keyof typeof volumes]}%
                      </span>
                    </div>
                    <input 
                      type="range" 
                      value={volumes[track.key as keyof typeof volumes]} 
                      onChange={(e) => setVolumes({...volumes, [track.key]: Number(e.target.value)})}
                      className={`w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer hover:scale-y-110 transition-transform shadow-inner ${track.col}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-gray-800 text-lg mb-4">Breathing Mode</h3>
              <select 
                value={breathingMode}
                onChange={(e) => setBreathingMode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              >
                <option>Box Breathing (4-4-4-4)</option>
                <option>Deep Relax (4-7-8)</option>
                <option>Awake (6-2)</option>
              </select>
            </div>

          </div>

        </div>

        {/* BOTTOM ROW: Insights & Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
              <span>🤖</span> AI Coach
            </h3>
            {loadingCoach ? (
               <div className="flex flex-col items-center justify-center h-32 opacity-50">
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
                 <p className="text-xs font-bold uppercase tracking-widest">Consulting Zenith...</p>
               </div>
            ) : aiCoach ? (
              <div 
                onClick={() => {
                   if (aiCoach.technique) {
                     setBreathingMode(aiCoach.technique);
                     startSession(`Coach: ${aiCoach.technique}`);
                   } else {
                     startSession("AI Suggestion: Re-Center");
                   }
                }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 mb-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <p className="text-sm text-purple-100 font-medium leading-relaxed mb-4">
                  {aiCoach.insight}
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest bg-purple-500/50 w-max px-3 py-1.5 rounded-lg shadow-sm">
                  ▶ Play {aiCoach.technique || "Suggestion"}
                </div>
              </div>
            ) : (
              <p className="text-sm opacity-60">Complete more sessions to unlock coaching.</p>
            )}
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4">Quick Sessions</h3>
            <div className="space-y-3">
              {CATEGORIES.map(c => (
                <div 
                  key={c.name} 
                  onClick={() => startSession(c.name)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-purple-50 hover:scale-[1.02] border border-gray-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm group-hover:rotate-12 transition-transform">
                      {c.icon}
                    </div>
                    <span className="font-bold text-gray-700 text-sm">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-md">{c.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-lg mb-4">Your Journey</h3>
            <div className="space-y-4">
              {journey.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-8">Your journey begins with your first breath.</p>
              ) : (
                journey.map((session: any) => (
                  <div key={session.id} className="flex gap-4 items-center pl-2 border-l-2 border-emerald-100">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-700">Mindful Session</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {new Date(session.completedAt).toLocaleDateString()} • {session.durationMinutes} mins
                      </p>
                    </div>
                    <span className="text-emerald-500 text-sm">✅</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
