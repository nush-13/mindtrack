"use client";

import { useEffect, useState } from "react";
import { quotes } from "@/lib/quotes";

export default function QuoteRotator() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(random);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#E6E6FA] rounded-3xl p-6 text-center shadow-md transition-opacity duration-1000">
      <p className="italic">"{quote}"</p>
    </div>
  );
}
