"use client";

import { User, Phone, Mail, Lock, Key, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function PersonalCredentials() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [journalPin, setJournalPin] = useState("");
  const [hasJournalPin, setHasJournalPin] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setName(data.name || "");
          setEmail(data.email || "");
          setPhoneNumber(data.phoneNumber || "");
          setHasJournalPin(data.hasJournalPin || false);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch profile", err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, currentPassword, newPassword, journalPin }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setJournalPin("");
        setHasJournalPin(data.hasJournalPin || false);
        
        if (session && data.name !== session.user?.name) {
             update({ name: data.name });
        }
      } else {
        setMessage({ text: data.error || "Failed to update profile", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred.", type: "error" });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex items-center justify-center h-full w-full font-bold text-gray-500 animate-pulse">Loading credentials...</div>;
  }

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow h-full w-full relative">
      <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
        <User className="w-6 h-6 text-indigo-500" /> Personal Credentials
      </h2>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 transition-all focus:bg-white" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> Phone Number</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 000-0000" 
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 transition-all focus:bg-white" 
            />
          </div>
        </div>

        <div>
           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> Email Address</label>
           <input 
            type="email" 
            value={email} 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-500 cursor-not-allowed" 
            readOnly
          />
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
           <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2"><Lock className="w-5 h-5 text-rose-500"/> Security & Password</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-gray-400"/> Current Password</label>
               <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 transition-all focus:bg-white" 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-gray-400"/> New Password</label>
               <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 transition-all focus:bg-white" 
               />
             </div>
           </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
           <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500"/> Journal Vault Security</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 {hasJournalPin ? "Update 4-Digit PIN" : "Setup 4-Digit PIN"}
               </label>
               <input 
                  type="password" 
                  maxLength={4}
                  placeholder={hasJournalPin ? "••••" : "Set 4-digit PIN"} 
                  value={journalPin}
                  onChange={e => setJournalPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900 transition-all focus:bg-white tracking-widest" 
               />
               <p className="text-[10px] text-gray-400 mt-2">PIN must be exactly 4 digits. Leave empty to keep existing.</p>
             </div>
             <div className="flex items-end italic text-xs text-gray-400 pb-3">
               {hasJournalPin ? "🔒 Vault Protection is ACTIVE" : "🔓 Vault Protection is NOT SETUP"}
             </div>
           </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
             >
                {isSaving ? "Saving..." : "Save Changes"}
             </button>
        </div>

      </div>
    </div>
  );
}
