"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/habits").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setHabits(data);
    }).catch(console.error);
  }, []);

  const addHabit = async () => {
    if (!name.trim()) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName("");
      fetch("/api/habits").then(r => r.json()).then(data => {
         if (Array.isArray(data)) setHabits(data);
      });
    }
  };

  const toggleHabit = async (habit: any) => {
    const newStatus = !habit.completedToday;
    const newStreak = newStatus ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    const res = await fetch("/api/habits", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: habit.id,
        completedToday: newStatus,
        streak: newStreak
      }),
    });

    if (res.ok) {
      fetch("/api/habits").then(r => r.json()).then(data => {
         if (Array.isArray(data)) setHabits(data);
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-teal-800">Daily Habits</h1>
        
        <div className="bg-white p-6 rounded-3xl shadow-md flex flex-wrap gap-4 items-center">
          <input
            className="flex-1 min-w-[200px] p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="What habit do you want to build?"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <button
            onClick={addHabit}
            className="bg-teal-500 text-white px-8 py-3 rounded-xl hover:bg-teal-600 transition shadow-sm font-semibold"
          >
            Add Habit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white p-6 rounded-3xl shadow-md flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg min-h-[140px]">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{habit.name}</h2>
                <button
                  onClick={() => toggleHabit(habit)}
                  className={`w-10 h-10 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-all ${
                    habit.completedToday 
                    ? "bg-teal-500 border-teal-500 text-white shadow-md transform scale-105" 
                    : "border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {habit.completedToday && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t">
                <div className="text-2xl">🔥</div>
                <div>
                   <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Streak</p>
                   <p className="font-bold text-teal-700">{habit.streak} days</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {habits.length === 0 && (
           <div className="text-center p-12 bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl">
              <p className="text-lg text-gray-500 font-medium">No habits tracking yet.</p>
              <p className="text-sm text-gray-400 mt-2">Start a new healthy routine today.</p>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
