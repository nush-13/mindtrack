"use client";

import Link from "next/link";
import { 
  ArrowRight,
  Phone,
  Sparkles
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ProgressAnalytics from "@/components/therapy/ProgressAnalytics";

export default function TherapyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-12 pb-12">
        
        {/* Header Setup */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              Therapy Hub <span className="text-2xl">🌱</span>
            </h1>
            <p className="text-base font-medium text-gray-500 mt-2">Your safe space for healing, reflection, and professional support.</p>
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors border border-red-100 shadow-sm">
               <Phone className="w-4 h-4" /> SOS Helpline
             </button>
          </div>
        </div>




        {/* Therapy Categories UI */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Choose What You're Struggling With</h3>
              <p className="text-gray-500 font-medium text-sm">Select a module to start your guided therapy journey.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
            {/* Anxiety */}
            <Link href="/therapy/anxiety" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-purple-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-purple-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                😰
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">Anxiety Disorders</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Overcome panic, worry & social anxiety.</p>
            </Link>

            {/* Mood Disorders */}
            <Link href="/therapy/mood" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-blue-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                🌧️
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">Mood Disorders</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Navigate depression & bipolar episodes.</p>
            </Link>

            {/* Trauma (PTSD) */}
            <Link href="/therapy/trauma" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-red-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-red-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-100 transition-all">
                ⚡
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">Trauma (PTSD)</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Cope with flashbacks & emotional triggers.</p>
            </Link>

            {/* OCD */}
            <Link href="/therapy/ocd" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-emerald-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                🔁
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">OCD</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Manage intrusive thoughts & compulsions.</p>
            </Link>

            {/* Eating Disorders */}
            <Link href="/therapy/eating" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-orange-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-100 transition-all">
                🍽️
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">Eating Disorders</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Build a healthier relationship with food.</p>
            </Link>

            {/* ADHD */}
            <Link href="/therapy/adhd" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-amber-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-all">
                🧩
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">ADHD</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Improve focus & executive function.</p>
            </Link>

            {/* Personality Disorders */}
            <Link href="/therapy/personality" className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg hover:border-pink-200 transition-all group flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 bg-pink-50 text-2xl rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-pink-100 transition-all">
                🎭
              </div>
              <h4 className="font-extrabold text-gray-900 mb-1">Personality Disorders</h4>
              <p className="text-xs text-gray-500 font-medium line-clamp-2">Regulate emotions & navigate relationships.</p>
            </Link>

          </div>
        </div>

        {/* Progress Analytics */}
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700">
           <ProgressAnalytics />
        </div>

      </div>
    </DashboardLayout>
  );
}
