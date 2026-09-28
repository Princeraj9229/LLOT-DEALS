import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string; // ISO date string
}

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeRemaining = (): TimeRemaining => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const difference = target - now;

    if (isNaN(target) || difference <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEnded: true,
      };
    }

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    return {
      total: difference,
      days,
      hours,
      minutes,
      seconds,
      isEnded: false,
    };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    // Initial check
    setTime(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTime(remaining);
      if (remaining.isEnded) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.isEnded) {
    return (
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shadow-2xs">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Sale Ended</span>
        <span className="text-xs text-rose-600/80">Stay tuned for upcoming festival offers!</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-amber-950/90 text-amber-50 backdrop-blur-md border border-amber-500/30 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Festival Sale Ends In</span>
      </div>

      <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm font-bold">
        {/* Days */}
        <div className="flex flex-col items-center bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20 min-w-[42px]">
          <span className="text-base text-amber-200">{String(time.days).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase font-sans text-amber-400/80 font-medium">Days</span>
        </div>
        <span className="text-amber-400 font-bold">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20 min-w-[42px]">
          <span className="text-base text-amber-200">{String(time.hours).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase font-sans text-amber-400/80 font-medium">Hours</span>
        </div>
        <span className="text-amber-400 font-bold">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20 min-w-[42px]">
          <span className="text-base text-amber-200">{String(time.minutes).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase font-sans text-amber-400/80 font-medium">Mins</span>
        </div>
        <span className="text-amber-400 font-bold">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20 min-w-[42px]">
          <span className="text-base text-amber-300">{String(time.seconds).padStart(2, '0')}</span>
          <span className="text-[9px] uppercase font-sans text-amber-400/80 font-medium">Secs</span>
        </div>
      </div>
    </div>
  );
};
