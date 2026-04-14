"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function MoodChart({ moods, title = "Last 7 Moods" }: { moods?: any[], title?: string } = {}) {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (moods && moods.length > 0) {
      setDataPoints(moods.map((m: any) => m.intensity));
      setLabels(moods.map((m: any) => new Date(m.date).toLocaleDateString(undefined, { weekday: "short" })));
      return;
    }
    
    // Only fetch if moods prop isn't passed (useful for other pages)
    if (!moods) {
      fetch("/api/moods")
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) return;
          setDataPoints(data.map((m: any) => m.intensity));
          setLabels(
            data.map((m: any) =>
              new Date(m.date).toLocaleDateString(undefined, { weekday: "short" })
            )
          );
        })
        .catch(console.error);
    } else {
      setDataPoints([]);
      setLabels([]);
    }
  }, [moods]);

  const data = {
    labels,
    datasets: [
      {
        label: "Mood Intensity",
        data: dataPoints,
        borderColor: "#9c51e0",
        backgroundColor: "rgba(156, 81, 224, 0.2)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#9c51e0",
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 1, max: 10, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="w-full h-full min-h-[240px] relative flex flex-col">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{title}</p>
      <div className="flex-1 w-full relative">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
