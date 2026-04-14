"use client";

import { useState, useEffect, useRef } from "react";

import EmergencyAlert from "./EmergencyAlert";
import { Sparkles, Bot, User, Activity } from "lucide-react";

type Question = {
  id: number;
  type: "options" | "critical";
  text: string;
  options: { val: number | string; label: string; alert?: boolean }[];
  multiplier: number;
};

const QUESTIONS: Question[] = [
  { 
    id: 1, type: "options", text: "Hi there! I'll ask you a few questions to understand your current mental headspace. First, how have you been feeling lately?", multiplier: 1,
    options: [ { val: 1, label: "Great 😊" }, { val: 2, label: "Good 🙂" }, { val: 3, label: "Okay 😐" }, { val: 4, label: "Bad 😞" }, { val: 5, label: "Awful 😫" } ] 
  },
  { 
    id: 2, type: "options", text: "Got it. Do you feel overwhelmed with stress frequently?", multiplier: 2,
    options: [ { val: 1, label: "Never" }, { val: 2, label: "Rarely" }, { val: 3, label: "Sometimes" }, { val: 4, label: "Often" }, { val: 5, label: "Always" } ] 
  },
  { 
    id: 3, type: "options", text: "How well have you been sleeping?", multiplier: 2,
    options: [ { val: 1, label: "Great" }, { val: 2, label: "Okay" }, { val: 3, label: "Mixed" }, { val: 4, label: "Bad" }, { val: 5, label: "Terrible" } ] 
  },
  { 
    id: 4, type: "options", text: "Do you find yourself overthinking a lot?", multiplier: 1,
    options: [ { val: 1, label: "Never" }, { val: 3, label: "Sometimes" }, { val: 5, label: "Always" } ] 
  },
  { 
    id: 5, type: "options", text: "Have you noticed any social withdrawal? Like avoiding friends or family?", multiplier: 1,
    options: [ { val: 1, label: "None" }, { val: 3, label: "Moderate" }, { val: 5, label: "Severe" } ] 
  },
  { 
    id: 6, type: "critical", text: "This is an important check: Have you had thoughts of harming yourself?", multiplier: 0,
    options: [ 
      { val: "yes", label: "Yes, frequently", alert: true }, 
      { val: "maybe", label: "Sometimes", alert: true },
      { val: "no", label: "No, never", alert: false }
    ] 
  }
];

type Message = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isTyping?: boolean;
};

export default function AssessmentFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showEmergency, setShowEmergency] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  
  // Results State
  const [isComplete, setIsComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isWaitingForUser]);

  // Initial load
  useEffect(() => {
    if (messages.length === 0 && step === 0) {
      appendBotQuestion(0);
    }
  }, []);

  const appendBotQuestion = (qIndex: number) => {
    setIsWaitingForUser(false);
    
    // Show typing indicator
    const typingId = `typing-${Date.now()}`;
    setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);

    setTimeout(() => {
      // Remove typing, add real message
      setMessages(prev => {
        const withoutTyping = prev.filter(m => m.id !== typingId);
        return [...withoutTyping, { id: `q-${qIndex}`, sender: 'ai', text: QUESTIONS[qIndex].text }];
      });
      setIsWaitingForUser(true);
    }, 1200); // 1.2s fake typing delay
  };

  const handleSelectOption = async (val: any, label: string) => {
    if (!isWaitingForUser) return;
    
    const currentQ = QUESTIONS[step];
    
    // Add user message
    setMessages(prev => [...prev, { id: `ans-${currentQ.id}`, sender: 'user', text: label }]);
    setIsWaitingForUser(false);

    // Save answer
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));

    if (currentQ.type === "critical") {
      if (val === "yes" || val === "maybe") {
        setTimeout(() => setShowEmergency(true), 800);
        return;
      }
    }

    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
      appendBotQuestion(step + 1);
    } else {
      // Finished
      const typingId = `typing-${Date.now()}`;
      setMessages(prev => [...prev, { id: typingId, sender: 'ai', text: '', isTyping: true }]);
      await finishAssessment();
    }
  };

  const finishAssessment = async () => {
    setSaving(true);
    let sum = 0;
    let maxPossible = 0;

    QUESTIONS.forEach(q => {
      if (q.type !== "critical" && answers[q.id]) {
        sum += answers[q.id] * q.multiplier;
        maxPossible += 5 * q.multiplier;
      }
    });

    const finalScore = maxPossible > 0 ? (sum / maxPossible) * 100 : 0;
    
    let severity: "Mild" | "Moderate" | "Severe" = "Mild";
    if (finalScore > 60) severity = "Severe";
    else if (finalScore > 30) severity = "Moderate";

    const insights = [];
    if (answers[2] >= 4 || answers[4] >= 3) {
      insights.push("You are experiencing high levels of stress and overthinking, which can quickly lead to burnout.");
    }
    if (answers[3] >= 4) {
      insights.push("Sleep disruption is playing a major role in your daily energy levels.");
    }
    if (answers[6] >= 4) {
      insights.push("Feelings of hopelessness are prominent. Talking to a professional is highly recommended.");
    }
    if (insights.length === 0) {
      insights.push("Your responses indicate a generally stable emotional state with some minor fluctuations.");
    }

    const payload = {
      score: Math.round(finalScore),
      severity,
      answers: JSON.stringify(answers)
    };

    try {
      await fetch("/api/therapy/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    }

    setScoreData({ score: Math.round(finalScore), severity, insights });
    setIsComplete(true);
    setSaving(false);
  };

  if (showEmergency) {
    return <EmergencyAlert onGoBack={() => setShowEmergency(false)} />;
  }

  if (isComplete && scoreData) {
    return (
    return (
      <div className="bg-[#fcfafc] rounded-[32px] overflow-hidden shadow-sm border border-[#f3ebf9] flex flex-col items-center justify-center text-center p-12 h-[700px] max-h-[85vh]">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Assessment Complete</h2>
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="text-4xl text-indigo-600 font-black">{scoreData.score}</span>
        </div>
        <p className="text-lg text-gray-600 font-medium mb-8 max-w-md mx-auto">
          Severity Level: <span className="font-bold text-gray-900">{scoreData.severity}</span>
        </p>
        <div className="space-y-4 mb-10 w-full max-w-md min-w-[300px]">
          {scoreData.insights.map((insight: string, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 text-sm font-medium text-gray-700 text-left shadow-sm">
              ✨ {insight}
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            setStep(0);
            setAnswers({});
            setMessages([]);
            setIsComplete(false);
            setScoreData(null);
            appendBotQuestion(0);
          }}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-md transition"
        >
          Retake Assessment
        </button>  
      </div>
    );
    );
  }

  const currentQ = QUESTIONS[step];
  // Calculate progress
  const progress = Math.round((step / QUESTIONS.length) * 100);

  return (
    <div className="bg-[#fcfafc] rounded-[32px] overflow-hidden shadow-sm border border-[#f3ebf9] flex flex-col h-[700px] max-h-[85vh]">
      
      {/* Disclaimer Top Bar */}
      <div className="bg-white border-b border-[#f3ebf9] px-6 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 shrink-0">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
             <Bot className="w-5 h-5 text-indigo-600" />
           </div>
           <div>
             <h3 className="font-bold text-gray-900 text-sm leading-tight">Therapy Assessment</h3>
             <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
               <Activity className="w-3 h-3 text-emerald-500" /> AI-guided check-in
             </p>
           </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">{progress}% Complete</span>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
             <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-2 shrink-0 self-end mb-1 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[75%] px-5 py-3.5 ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm shadow-[0_4px_14px_rgba(79,70,229,0.2)]'
                : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm shadow-[0_4px_14px_rgba(0,0,0,0.03)]'
            }`}>
              {msg.isTyping ? (
                <div className="flex items-center gap-1.5 h-5 px-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              ) : (
                <p className="text-[15px] font-medium leading-relaxed">{msg.text}</p>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 ml-2 shrink-0 self-end mb-1 overflow-hidden">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {saving && (
           <div className="flex justify-center text-sm font-bold text-indigo-500 animate-pulse py-4">
             <Sparkles className="w-4 h-4 mr-2" /> Unlocking Insights...
           </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Options Input Area */}
      <div className="bg-white border-t border-[#f3ebf9] p-4 shrink-0 transition-all duration-500 min-h-[120px] flex items-center justify-center">
        {isWaitingForUser ? (
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 w-full">
            {currentQ.options.map(opt => (
              <button
                key={opt.val}
                onClick={() => handleSelectOption(opt.val, opt.label)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${
                  opt.alert 
                    ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100" 
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-300 text-sm font-medium">Please wait...</div>
        )}
      </div>
      
    </div>
  );
}
