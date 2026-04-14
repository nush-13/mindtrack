import { Phone, ShieldAlert, ArrowLeft } from "lucide-react";

export default function EmergencyAlert({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] bg-red-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden border-2 border-red-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 text-center mb-4">You're not alone. Help is available.</h2>
        <p className="text-gray-600 text-center text-lg mb-8 leading-relaxed">
          It sounds like you are going through a very difficult time. Please reach out to someone who can help right now.
        </p>
        
        <div className="bg-red-50 rounded-2xl p-6 mb-8 border border-red-100">
          <h3 className="text-red-900 font-bold mb-4 uppercase tracking-wider text-sm">National Helplines (India)</h3>
          
          <div className="space-y-4">
            <a href="tel:9152987821" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">AASRA Helpline</p>
                  <p className="text-sm text-gray-500">24x7 Suicide Prevention</p>
                </div>
              </div>
              <span className="font-mono font-bold text-green-700 group-hover:text-green-800 tracking-wide">9820466726</span>
            </a>

            <a href="tel:104" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Health Helpline</p>
                  <p className="text-sm text-gray-500">Government Support</p>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-700 group-hover:text-blue-800 tracking-wide">104</span>
            </a>
          </div>
        </div>

        <button 
          onClick={onGoBack}
          className="w-full flex justify-center items-center gap-2 text-gray-500 font-medium hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go back to assessment
        </button>
      </div>
    </div>
  );
}
