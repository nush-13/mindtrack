"use client";

import { useState } from "react";
import { CategoryConfig } from "@/lib/therapyContent";
import InteractiveExercise from "./InteractiveExercise";
import SeveritySafetyLayer from "./SeveritySafetyLayer";
import { ArrowRight, CheckCircle2, ChevronRight, PlayCircle, Brain, Target, Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  content: CategoryConfig;
  journey: any; 
}

// TAILWIND SAFELIST FOR DYNAMIC COLORS
// PURPLE: bg-purple-600 bg-purple-700 bg-purple-50 bg-purple-100 text-purple-600 text-purple-700 text-purple-500 from-purple-600 to-purple-800 border-purple-200 ring-purple-500 hover:bg-purple-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700
// BLUE: bg-blue-600 bg-blue-700 bg-blue-50 bg-blue-100 text-blue-600 text-blue-700 text-blue-500 from-blue-600 to-blue-800 border-blue-200 ring-blue-500 hover:bg-blue-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700
// RED: bg-red-600 bg-red-700 bg-red-50 bg-red-100 text-red-600 text-red-700 text-red-500 from-red-600 to-red-800 border-red-200 ring-red-500 hover:bg-red-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700
// EMERALD: bg-emerald-600 bg-emerald-700 bg-emerald-50 bg-emerald-100 text-emerald-600 text-emerald-700 text-emerald-500 from-emerald-600 to-emerald-800 border-emerald-200 ring-emerald-500 hover:bg-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700
// ORANGE: bg-orange-600 bg-orange-700 bg-orange-50 bg-orange-100 text-orange-600 text-orange-700 text-orange-500 from-orange-600 to-orange-800 border-orange-200 ring-orange-500 hover:bg-orange-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700
// AMBER: bg-amber-600 bg-amber-700 bg-amber-50 bg-amber-100 text-amber-600 text-amber-700 text-amber-500 from-amber-600 to-amber-800 border-amber-200 ring-amber-500 hover:bg-amber-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700
// PINK: bg-pink-600 bg-pink-700 bg-pink-50 bg-pink-100 text-pink-600 text-pink-700 text-pink-500 from-pink-600 to-pink-800 border-pink-200 ring-pink-500 hover:bg-pink-700 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700

export default function TherapyModuleClient({ content, journey }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "quiz" | "video" | "exercise" | "insights">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [severity, setSeverity] = useState<"Mild" | "Moderate" | "Severe">("Mild");
  const [score, setScore] = useState(0);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkedSymptoms, setCheckedSymptoms] = useState<Record<number, boolean>>({});

  const handleQuizSubmit = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    setScore(totalScore);
    
    // Scale: 0-15 max
    let calculatedSeverity: "Mild" | "Moderate" | "Severe" = "Mild";
    if (totalScore >= 10) calculatedSeverity = "Severe";
    else if (totalScore >= 5) calculatedSeverity = "Moderate";
    
    setSeverity(calculatedSeverity);
    setStep("video");
  };

  const handleFinishExercise = async () => {
    setStep("insights");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/therapy/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: content.id,
          score,
          severity,
          answers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiNote(data.aiNote || "We recognized your effort! Keep utilizing the exercises to maintain balance.");
      } else {
        const errorData = await res.json();
        setAiNote(`Note not generated: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      setAiNote("We encountered an issue saving your reflection. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header Banner */}
      <div className={`bg-gradient-to-r from-${content.color}-600 to-${content.color}-800 rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden mb-8`}>
         <div className="absolute top-0 right-0 p-8 opacity-20 text-8xl scale-150 translate-x-10 -translate-y-10 pointer-events-none">
            {content.icon}
         </div>
         <div className="relative z-10 flex flex-col items-start">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              Module • Day {journey?.currentDay || 1}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">{content.title}</h1>
            <p className="text-white/80 font-medium text-lg max-w-xl">{content.description}</p>
         </div>
      </div>

      {step === "insights" && <SeveritySafetyLayer severity={severity} />}

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-12">
        {step === "intro" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="flex items-center gap-4 mb-8">
               <div className={`w-12 h-12 bg-${content.color}-100 rounded-2xl flex items-center justify-center`}>
                  <Brain className={`w-6 h-6 text-${content.color}-600`}/>
               </div>
               <h2 className="text-2xl font-black text-gray-900">Understanding Your Experience</h2>
             </div>
             
             <p className="text-gray-500 mb-8 font-medium">Read through these common symptoms. Check any that you have been experiencing recently. This helps build awareness.</p>
             
             <div className="space-y-3 mb-10">
               {content.symptoms.map((symptom, idx) => (
                  <label key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${checkedSymptoms[idx] ? `bg-${content.color}-50 border-${content.color}-200` : 'bg-white border-gray-100 hover:border-gray-300'}`}>
                    <input 
                      type="checkbox" 
                      className={`mt-1 w-5 h-5 rounded text-${content.color}-600 focus:ring-${content.color}-500`}
                      checked={!!checkedSymptoms[idx]}
                      onChange={(e) => setCheckedSymptoms(prev => ({...prev, [idx]: e.target.checked}))}
                    />
                    <span className={`text-sm ${checkedSymptoms[idx] ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>{symptom}</span>
                  </label>
               ))}
             </div>

             <button onClick={() => setStep("quiz")} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition bg-${content.color}-600 text-white hover:bg-${content.color}-700 shadow-md`}>
               Continue to Assessment <ChevronRight className="w-5 h-5"/>
             </button>
          </div>
        )}

        {step === "quiz" && (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center`}>
                     <Target className="w-6 h-6 text-gray-600"/>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Mini Assessment</h2>
                </div>
                <span className="text-sm font-bold text-gray-400">
                  {answers.length < content.quiz.length ? `Question ${answers.length + 1} / ${content.quiz.length}` : 'Complete'}
                </span>
             </div>

             {answers.length < content.quiz.length ? (
                <div className="space-y-6">
                   <h3 className="text-xl font-bold text-gray-800">{content.quiz[answers.length].question}</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {content.quiz[answers.length].options.map((opt, idx) => (
                        <button key={idx} onClick={() => setAnswers([...answers, opt.score])} className={`p-5 rounded-2xl border border-gray-100 bg-gray-50 text-left font-bold text-gray-700 hover:bg-${content.color}-50 hover:border-${content.color}-200 hover:text-${content.color}-700 transition shadow-sm`}>
                          {opt.text}
                        </button>
                     ))}
                   </div>
                </div>
             ) : (
                <div className="text-center py-10 space-y-6">
                  <CheckCircle2 className={`w-20 h-20 text-${content.color}-500 mx-auto mb-4 animate-bounce`} />
                  <h3 className="text-3xl font-black text-gray-900">Assessment Complete</h3>
                  <p className="text-gray-500">We've tailored the next steps based on your responses.</p>
                  <button onClick={handleQuizSubmit} className={`px-8 py-4 bg-${content.color}-600 text-white rounded-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition`}>
                     Unlock Guided Exercise
                  </button>
                </div>
             )}
          </div>
        )}

        {step === "video" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-4 mb-8">
               <div className={`w-12 h-12 bg-${content.color}-100 rounded-2xl flex items-center justify-center`}>
                  <PlayCircle className={`w-6 h-6 text-${content.color}-600`}/>
               </div>
               <h2 className="text-2xl font-black text-gray-900">Guided Education</h2>
             </div>
             
               <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-gray-200 mb-8 bg-gray-900">
               <iframe 
                 width="100%" height="100%" 
                 src={`https://www.youtube.com/embed/${content.videoId}?rel=0&autoplay=1`} 
                 title="YouTube Video" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
             </div>

             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
               <div>
                  <h4 className="font-bold text-gray-800 mb-1">Did this help you understand your feelings?</h4>
                  <p className="text-sm text-gray-500">Take a moment to process before continuing.</p>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => setStep("exercise")} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition">Skip for now</button>
                 <button onClick={() => setStep("exercise")} className={`px-6 py-3 bg-${content.color}-600 text-white rounded-xl font-bold hover:bg-${content.color}-700 transition shadow-sm`}>Yes, Continue</button>
               </div>
             </div>
          </div>
        )}

        {step === "exercise" && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center gap-4 mb-8">
               <div className={`w-12 h-12 bg-${content.color}-100 rounded-2xl flex items-center justify-center`}>
                  <Compass className={`w-6 h-6 text-${content.color}-600`}/>
               </div>
               <h2 className="text-2xl font-black text-gray-900">Practical Tool: {content.exerciseTitle}</h2>
             </div>

             <InteractiveExercise type={content.exerciseId} />

             <div className="mt-10 text-center">
                <button onClick={handleFinishExercise} className={`px-8 py-4 bg-${content.color}-600 text-white rounded-2xl font-bold shadow-md hover:scale-105 active:scale-95 transition inline-flex items-center gap-2`}>
                   Complete Module <CheckCircle2 className="w-5 h-5"/>
                </button>
             </div>
          </div>
        )}

        {step === "insights" && (
          <div className="animate-in fade-in zoom-in duration-700 text-center py-10 max-w-2xl mx-auto">
             <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
               <SparklesIcon />
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-4">Module Complete!</h2>
             
             <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl mb-8 relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
                 AI Reflection
               </div>
               {isGenerating ? (
                 <div className="flex space-x-2 justify-center items-center h-16">
                   <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></span>
                   <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               ) : (
                 <p className="text-indigo-900 font-medium leading-relaxed italic text-lg">"{aiNote}"</p>
               )}
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/journal" className="px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-50 transition drop-shadow-sm flex items-center justify-center gap-2">
                 Journal Your Thoughts
               </Link>
               <button onClick={() => router.push('/therapy')} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition drop-shadow-sm flex items-center justify-center gap-2">
                 Return to Hub <ArrowRight className="w-5 h-5"/>
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SparklesIcon() {
   return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
}
