"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "./UserProfile";

const links = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Mood Tracker", href: "/mood", icon: "😊" },
  { name: "Journal", href: "/journal", icon: "📝" },
  { name: "Meditation", href: "/meditation", icon: "🧘" },
  { name: "Therapy", href: "/therapy", icon: "👩‍⚕️" },
  { name: "Profile", href: "/profile", icon: "👤" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#fbf4fc] via-[#fdfbfd] to-[#f4edfa] font-sans selection:bg-purple-200">
        <aside className="hidden w-[260px] bg-white pt-8 pb-6 px-5 shadow-[4px_0_24px_rgba(156,81,224,0.04)] flex-col md:flex z-20 border-r border-[#f3ebf9]/80 fixed h-full left-0">
          <div className="flex-1">
            <div className="mb-[50px] px-2 flex flex-col pt-2">
               <h1 className="text-[26px] font-extrabold text-[#9c51e0] tracking-tight leading-none mb-1 shadow-sm">MindTrack</h1>
               <p className="text-[13px] text-gray-400 font-medium">Mental Health Companion</p>
            </div>
            
            <nav className="space-y-[6px] text-[15px] font-semibold text-gray-500 flex flex-col">
              {links.map(link => {
                const isActive = pathname === link.href || (pathname !== "/" && link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ease-out group ${
                      isActive ? "bg-[#f5eefa] text-[#9c51e0] shadow-[inset_0_2px_10px_rgba(156,81,224,0.05)]" : "hover:bg-[#fbf7fc] hover:text-[#7b3caa]"
                    }`}
                  >
                     <div className={`flex items-center justify-center text-lg w-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-[-5deg]'}`}>
                       {link.icon}
                     </div>
                     <span className="mb-0.5 tracking-wide">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <UserProfile />
        </aside>

        <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto min-h-screen relative md:ml-[260px] scroll-smooth">
           {/* Background decorative blobs */}
           <div className="fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#f4edfa]/60 blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>
           <div className="fixed bottom-[-10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-[#fde9f6]/40 blur-[80px] pointer-events-none -z-10 animate-float-slow"></div>
           
           <div className="max-w-[1100px] w-full mx-auto">
             {children}
           </div>
        </main>
      </div>
  );
}