"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) {
    return <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-center"><div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="mt-auto border-t border-gray-100 pt-7 flex flex-col items-start w-full px-1">
      <div className="flex items-center gap-3.5 mb-5 w-full cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all duration-300 group">
        <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-[#9c51e0] via-[#ae66eb] to-[#d685ff] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(156,81,224,0.3)] group-hover:shadow-[0_6px_16px_rgba(156,81,224,0.4)] transition-all group-hover:scale-105">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-[15px] font-bold text-gray-800 truncate tracking-tight">{session.user.name}</p>
        </div>
      </div>
      <button 
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-[13px] text-gray-500 hover:text-[#dc3545] font-semibold transition-all px-2 text-left w-full flex items-center gap-2 group"
      >
        Sign Out
        <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">→</span>
      </button>
    </div>
  );
}
