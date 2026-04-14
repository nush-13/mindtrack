"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const moods = ["😢", "😕", "😐", "🙂", "😄"];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");

  const router = useRouter();

  const saveMood = async () => {
    if (!selectedMood) return;

    const res = await fetch("/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood: selectedMood, intensity, note }),
    });

    if (res.ok) {
      setSelectedMood(null);
      setNote("");
      alert("Mood saved 🌿");
      router.refresh();
    } else {
      alert("Failed to save mood");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md space-y-4">
      <h2 className="text-lg font-semibold">How are you feeling today?</h2>

      <div className="flex space-x-4 text-3xl">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMood(m)}
            className={`transition-transform ${
              selectedMood === m ? "scale-125" : ""
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm">Intensity: {intensity}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-teal-500"
        />
      </div>

      <textarea
        placeholder="Add a note..."
        className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={saveMood}
        className="bg-[#6FB1A0] text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
      >
        Save Mood
      </button>
    </div>
  );
}