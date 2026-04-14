"use client";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import ProfileStats from "@/components/profile/ProfileStats";
import PersonalCredentials from "@/components/profile/PersonalCredentials";
import { Sparkles, Activity } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "MindTrack Explorer";
  const userInitials = userName.charAt(0).toUpperCase();

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));
  }, []);

  if (!analytics) return <DashboardLayout><div className="flex h-screen items-center justify-center">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Profile Header & Snapshot */}
        <div className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-800 rounded-[32px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-20 -translate-y-20"></div>
           
           <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
             <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-[4px] border-white/30 flex items-center justify-center shadow-2xl relative">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white/90">{userInitials}</span>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-4 border-indigo-900 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
             </div>
             
             <div>
               <h1 className="text-3xl font-black tracking-tight mb-1">{userName}</h1>
               <p className="text-indigo-200 font-medium">{session?.user?.email ? session.user.email : "Joined recently"} • MindTrack Pro</p>
             </div>
           </div>


        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column - Personal Credentials */}
           <div className="lg:col-span-2">
              <PersonalCredentials />
           </div>

           {/* Right Column - Gamification Stats */}
           <div>
              <ProfileStats stats={analytics} />
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
