"use client";

import { useState } from "react";
import { Settings, Lock, Bell, Palette, Download, Bot } from "lucide-react";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("preferences");

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[500px]">
      
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" /> Account Settings
        </h2>
      </div>

      <div className="flex border-b border-gray-100 shrink-0">
        <button 
          onClick={() => setActiveTab("preferences")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'preferences' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Preferences
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Security
        </button>
        <button 
          onClick={() => setActiveTab("data")}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'data' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Data
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        
        {activeTab === "preferences" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-gray-400"/> UI Theme</p>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Calm (Light Mode)</option>
                <option>Deep Focus (Dark Mode)</option>
                <option>Pastel Dawn</option>
              </select>
            </div>
            
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2"><Bot className="w-4 h-4 text-gray-400"/> AI Tone Personalization</p>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Empathetic & Casual (Aura)</option>
                <option>Clinical & Direct</option>
                <option>Motivational Coach</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
              <div>
                <p className="font-bold text-sm text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4 text-gray-400"/> Reminders</p>
                <p className="text-xs text-gray-500 mt-0.5">Daily mood & meditation alerts</p>
              </div>
              <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between p-4 border border-rose-100 bg-rose-50 rounded-xl">
              <div>
                <p className="font-bold text-sm text-rose-900 flex items-center gap-2"><Lock className="w-4 h-4 text-rose-500"/> Private Mode</p>
                <p className="text-xs text-rose-700/70 mt-0.5">Require PIN to open journal</p>
              </div>
              <div className="w-10 h-6 bg-rose-300 rounded-full relative cursor-pointer shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold border border-gray-200 rounded-xl transition-colors text-sm">
              Change Password
            </button>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button className="w-full flex justify-between items-center py-4 px-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 rounded-xl transition-colors text-sm group">
              <span className="flex items-center gap-2"><Download className="w-4 h-4"/> Download Mental Health Report</span>
              <span className="text-xs bg-indigo-200 px-2 py-1 rounded-md group-hover:bg-indigo-300 transition-colors">PDF</span>
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed tracking-wide">
              Your data is end-to-end encrypted. MindTrack never sells your personal psychological profile or journal entries.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
