"use client";

import { useState, useEffect } from "react";
import { Play, Square, RefreshCcw } from "lucide-react";

interface ExerciseProps {
  type: string;
}

export default function InteractiveExercise({ type }: ExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);

  const playMeditationBell = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // Calming E4 note
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {
      console.error(e);
    }
  };

  // Simple box breathing logic
  useEffect(() => {
    if (!isActive || type !== "box-breathing") return;
    playMeditationBell(); // initial beat
    const interval = setInterval(() => {
      setStep((s) => {
        playMeditationBell();
        return (s + 1) % 4;
      });
    }, 4000); // 4 seconds per phase
    return () => clearInterval(interval);
  }, [isActive, type]);

  const INSTRUCTIONS: Record<string, string[]> = {
    "box-breathing": ["Inhale...", "Hold...", "Exhale...", "Hold Empty..."],
    "grounding": ["Find 5 things you can see", "Find 4 things you can feel", "Find 3 things you can hear", "Find 2 things you can smell", "Find 1 thing you can taste"],
    "thought-labeling": ["Notice your thought", "Label it: 'This is just a thought'", "Let it drift away like a cloud"],
    "gratitude": ["Think of your body", "What is one thing it did for you today?", "Thank it silently."],
    "safe-space": ["Close your eyes", "Visualize a place you feel completely safe", "What colors do you see?", "What sounds do you hear?"],
    "task-activation": ["Pick ONE tiny task", "Count down: 3... 2... 1...", "Do it for just 2 minutes"],
    "emotion-regulation": ["S - Stop what you are doing", "T - Take a breath", "O - Observe your thoughts & feelings", "P - Proceed mindfully"]
  };

  const steps = INSTRUCTIONS[type] || ["Begin exercise"];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-8 text-center relative overflow-hidden flex flex-col items-center">
      
      {/* Decorative bg */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
      
      <div className="relative z-10 w-full">
        <h4 className="text-xl font-bold text-indigo-900 mb-8 capitalize">{type.replace("-", " ")}</h4>

        <div className="min-h-[350px] flex items-center justify-center mb-8 w-full mt-10">
          {type === "box-breathing" ? (
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out ${isActive ? (step === 0 ? 'scale-[1.8] bg-indigo-200/40 border-[6px] border-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.4)]' : step === 1 ? 'scale-[1.8] bg-indigo-100/30 border-[6px] border-indigo-300 opacity-90 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : step === 2 ? 'scale-100 bg-indigo-50 border-[4px] border-indigo-500 shadow-none' : 'scale-100 border-[4px] bg-white border-indigo-300 opacity-80') : 'scale-100 border-4 border-indigo-200 bg-white'}`}></div>
              
              {/* Dynamic decorative particles (only visible when active and not empty) */}
              {isActive && (step === 0 || step === 1) && (
                 <div className="absolute inset-0 w-full h-full rounded-full animate-ping opacity-20 bg-indigo-400 pointer-events-none duration-[4000ms]"></div>
              )}

              {/* Inner Text Circle */}
              <span className="relative z-10 text-2xl font-black text-indigo-800 w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.2)] delay-75 duration-700 transition-all text-center leading-tight tracking-wide px-4 border shadow-indigo-200">
                 {isActive ? steps[step] : "Ready"}
              </span>
            </div>
          ) : (
            <div className="text-center w-full max-w-sm">
               {isActive ? (
                  <div className="text-2xl font-black text-indigo-800 animate-in fade-in zoom-in duration-500 key={step}">
                     {steps[step]}
                  </div>
               ) : (
                  <div className="text-indigo-400 font-medium">Click Start to begin</div>
               )}
            </div>
          )}
        </div>

        {/* Controls */}
         <div className="flex justify-center gap-4">
            {!isActive ? (
               <button onClick={() => { setIsActive(true); setStep(0); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition">
                 <Play className="w-5 h-5" /> Start Exercise
               </button>
            ) : (
               <>
                 {type !== "box-breathing" && step < steps.length - 1 && (
                    <button onClick={() => { playMeditationBell(); setStep(s => s + 1); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition">
                      Next Step <ArrowRightIcon />
                    </button>
                 )}
                 {type !== "box-breathing" && step === steps.length - 1 && (
                    <button onClick={() => setIsActive(false)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition">
                      Finish
                    </button>
                 )}
                 <button onClick={() => { setIsActive(false); setStep(0); }} className="flex items-center gap-2 bg-white text-gray-500 border border-gray-200 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                   <Square className="w-5 h-5" /> Stop
                 </button>
               </>
            )}
         </div>

      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
