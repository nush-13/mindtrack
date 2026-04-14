"use client";

import { AlertTriangle, Phone, Search, XCircle } from "lucide-react";

interface Props {
  severity: "Mild" | "Moderate" | "Severe";
  onClose?: () => void;
}

export default function SeveritySafetyLayer({ severity, onClose }: Props) {
  if (severity !== "Severe") return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden shadow-sm">
       <div className="absolute top-0 right-0 p-8 opacity-5">
          <AlertTriangle className="w-48 h-48 text-red-900" />
       </div>

       <div className="flex items-start gap-4 relative z-10">
         <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
           <AlertTriangle className="w-6 h-6 text-red-600" />
         </div>
         
         <div className="flex-1">
            <div className="flex justify-between items-start">
               <h3 className="text-xl font-black text-red-900 mb-2">You are not alone. Please get help.</h3>
               {onClose && (
                  <button onClick={onClose} className="text-red-400 hover:text-red-700 transition">
                     <XCircle className="w-5 h-5"/>
                  </button>
               )}
            </div>
            
            <p className="text-red-700 font-medium mb-6">
              Your responses indicate a severe level of distress. Digital tools are not a replacement for professional or emergency help. Please reach out to someone immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
               <a href="tel:988" className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 shadow-md transition w-max">
                 <Phone className="w-4 h-4"/> Call 988 (Lifeline)
               </a>
               <a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer" className="bg-white text-red-700 border border-red-200 px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition w-max">
                 <Search className="w-4 h-4"/> Find a Therapist
               </a>
            </div>
         </div>
       </div>
    </div>
  );
}
