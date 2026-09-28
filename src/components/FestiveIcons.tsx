import React from 'react';
import { Platform } from '../types';

export const DiyaIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Flame with glowing core */}
    <path
      d="M24 4C24 4 29 13 29 19C29 22.3137 26.7614 25 24 25C21.2386 25 19 22.3137 19 19C19 13 24 4 24 4Z"
      fill="url(#flameGradient)"
      className="diya-flame"
    />
    <path
      d="M24 10C24 10 26.5 15 26.5 18C26.5 19.6569 25.3807 21 24 21C22.6193 21 21.5 19.6569 21.5 18C21.5 15 24 10 24 10Z"
      fill="#FEF08A"
      className="diya-flame"
    />
    {/* Diya Base */}
    <path
      d="M8 26C8 26 12 38 24 38C36 38 40 26 40 26C35 28 30 29 24 29C18 29 13 28 8 26Z"
      fill="url(#diyaBase)"
    />
    <path
      d="M18 38C20 40 21.5 41 24 41C26.5 41 28 40 30 38"
      stroke="#B45309"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Decorative rim */}
    <path
      d="M8 26C12 28 17.5 29 24 29C30.5 29 36 28 40 26"
      stroke="#FDE047"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="flameGradient" x1="24" y1="4" x2="24" y2="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="0.6" stopColor="#EA580C" />
        <stop offset="1" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="diyaBase" x1="8" y1="26" x2="40" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="0.5" stopColor="#B45309" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

export const DurgaPujaMotif: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Sacred Durga Eyes and Trishul motif */}
    <path
      d="M32 6V26M26 12C26 16 32 20 32 20M38 12C38 16 32 20 32 20"
      stroke="#DC2626"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Third Eye / Bindi */}
    <circle cx="32" cy="30" r="3.5" fill="#DC2626" />
    <path
      d="M32 24C32 24 30 28 32 30C34 28 32 24 32 24Z"
      fill="#F59E0B"
    />
    {/* Left Eye */}
    <path
      d="M12 38C17 32 24 33 26 38C22 43 17 41 12 38Z"
      stroke="#1E1B4B"
      strokeWidth="2"
      fill="#FEF2F2"
    />
    <circle cx="20" cy="37" r="2.5" fill="#1E1B4B" />
    {/* Right Eye */}
    <path
      d="M52 38C47 32 40 33 38 38C42 43 47 41 52 38Z"
      stroke="#1E1B4B"
      strokeWidth="2"
      fill="#FEF2F2"
    />
    <circle cx="44" cy="37" r="2.5" fill="#1E1B4B" />
    {/* Traditional floral nose ornament accent */}
    <path
      d="M28 46C28 46 32 50 36 46"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ChhathPujaSun: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Morning Sun Rays */}
    <circle cx="32" cy="32" r="14" fill="url(#sunCore)" />
    <path
      d="M32 6V12M32 52V58M6 32H12M52 32H58M14 14L18 18M46 46L50 50M14 50L18 46M46 14L50 18"
      stroke="#F59E0B"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* River Wave Arghya */}
    <path
      d="M12 48C18 46 22 50 28 48C34 46 38 50 44 48C48 46 51 49 52 48"
      stroke="#D97706"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <radialGradient id="sunCore" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(14)">
        <stop stopColor="#FBBF24" />
        <stop offset="0.7" stopColor="#F97316" />
        <stop offset="1" stopColor="#EA580C" />
      </radialGradient>
    </defs>
  </svg>
);

export const PlatformBadge: React.FC<{ platform: Platform; className?: string }> = ({ platform, className = '' }) => {
  switch (platform) {
    case 'Flipkart':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-blue-50 text-blue-700 border-blue-200/80 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          Flipkart
        </span>
      );
    case 'Myntra':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-rose-50 text-rose-700 border-rose-200/80 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          Myntra
        </span>
      );
    case 'Meesho':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-fuchsia-600 inline-block" />
          Meesho
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border bg-slate-100 text-slate-700 border-slate-200 ${className}`}>
          {platform}
        </span>
      );
  }
};
