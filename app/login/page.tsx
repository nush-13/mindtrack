"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Compass, HeartPulse, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.ok) {
      router.push("/");
    } else {
      alert("Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4 selection:bg-purple-500/30">
      {/* Decorative Glows */}
      <div className="cosmic-glow -top-20 -left-20 animate-pulse-slow"></div>
      <div className="cosmic-glow -bottom-20 -right-20 animate-pulse-slow font-serif" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1000px] h-full max-h-[640px] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* LEFT PANEL: Branding & Features */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#9c51e0]/90 to-[#6366f1]/90 p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden">
           {/* Abstract Circle Backgrounds */}
           <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>

           <div className="relative z-10">
             <h1 className="text-5xl font-serif font-bold tracking-tight mb-3">MindTrack</h1>
             <p className="text-purple-100 italic text-lg opacity-90 mb-12">Your journey to inner peace starts here</p>

             <div className="space-y-8">
               <div className="flex items-center gap-5 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                   <Compass className="w-6 h-6 text-purple-200" />
                 </div>
                 <span className="text-sm font-medium text-purple-50 tracking-wide">Guided mental exercises & meditations</span>
               </div>

               <div className="flex items-center gap-5 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                   <HeartPulse className="w-6 h-6 text-purple-200" />
                 </div>
                 <span className="text-sm font-medium text-purple-50 tracking-wide">Daily mood tracking & insights</span>
               </div>

               <div className="flex items-center gap-5 group">
                 <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                   <ShieldCheck className="w-6 h-6 text-purple-200" />
                 </div>
                 <span className="text-sm font-medium text-purple-50 tracking-wide">Private & secure therapy tools</span>
               </div>
             </div>
           </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="md:w-7/12 bg-white/95 backdrop-blur-md p-10 md:p-14 flex flex-col justify-center">
           
           {/* TAB SWITCHER */}
           <div className="bg-[#f3f4f6] p-1.5 rounded-full flex gap-1 mb-10 w-full max-w-sm mx-auto shadow-inner">
             <button className="flex-1 py-3 text-sm font-bold bg-gradient-to-r from-[#9c51e0] to-[#6366f1] text-white rounded-full shadow-lg transform transition-transform active:scale-95">
               Log In
             </button>
             <Link href="/register" className="flex-1 py-3 text-sm font-bold text-purple-400 hover:text-purple-600 rounded-full flex items-center justify-center transition-colors">
               Sign Up
             </Link>
           </div>

           <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto w-full">
             <div className="space-y-1.5 group">
               <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-300 group-focus-within:text-[#9c51e0] transition-colors">
                   <Mail className="w-4 h-4" />
                 </div>
                 <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[#f9fafb] border border-gray-100 group-focus-within:border-purple-200 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-gray-300 text-gray-600 font-medium text-sm focus:bg-white shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
               </div>
             </div>

             <div className="space-y-1.5 group">
               <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-300 group-focus-within:text-[#9c51e0] transition-colors">
                   <Lock className="w-4 h-4" />
                 </div>
                 <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#f9fafb] border border-gray-100 group-focus-within:border-purple-200 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-gray-300 text-gray-600 font-medium text-sm focus:bg-white shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
               </div>
               <div className="text-right">
                 <Link href="#" className="text-[12px] font-bold text-blue-500 hover:text-blue-700 transition-colors tracking-tight">
                   Forgot password?
                 </Link>
               </div>
             </div>

             <button 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#9c51e0] to-[#6366f1] text-white py-4 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(156,81,224,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
             >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                 <>
                   Welcome Back
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
           </form>
        </div>
      </div>
    </div>
  );
}
