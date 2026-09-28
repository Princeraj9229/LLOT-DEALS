import React, { useState } from 'react';
import { SaleSettings } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { DiyaIcon } from './FestiveIcons';
import { ShoppingBag, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { GrandDurgaPratimaArtwork, DivineSuryaChhathArtwork } from './FestiveDivineArtwork';

interface HeroSectionProps {
  settings: SaleSettings;
  onShopNow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onShopNow }) => {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient glowing lights & decorative patterns */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-rose-500 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      {/* Divine Festive Background Artworks: Maa Durga (Left) and Bhagwan Surya (Right) */}
      <div className="absolute -left-16 top-10 w-72 md:w-96 h-96 opacity-20 hover:opacity-40 transition-opacity duration-700 pointer-events-none select-none hidden sm:block">
        <GrandDurgaPratimaArtwork className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]" />
      </div>

      <div className="absolute -right-16 top-10 w-72 md:w-96 h-96 opacity-20 hover:opacity-40 transition-opacity duration-700 pointer-events-none select-none hidden sm:block">
        <DivineSuryaChhathArtwork className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]" />
      </div>

      {/* Floating decorative light points */}
      <div className="absolute top-8 left-8 hidden sm:block opacity-70 floating-element pointer-events-none">
        <DiyaIcon size={32} className="text-amber-300" />
      </div>
      <div className="absolute top-16 right-12 hidden sm:block opacity-70 floating-element pointer-events-none" style={{ animationDelay: '1.5s' }}>
        <DiyaIcon size={28} className="text-amber-400" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Promotional Banner (Admin Configured) */}
        {settings.banner_active && settings.banner_notice && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold mb-6 max-w-3xl backdrop-blur-md shadow-xs">
            <span className="shrink-0">🔥</span>
            <span className="truncate">{settings.banner_notice}</span>
          </div>
        )}

        {/* Festival Trilogy Sub-Tag */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-widest text-amber-300 font-semibold mb-3">
          <span className="hover:text-rose-300 transition-colors">🌺 Durga Puja</span>
          <span className="text-amber-500/60">•</span>
          <span className="hover:text-amber-300 transition-colors">🪔 Diwali</span>
          <span className="text-amber-500/60">•</span>
          <span className="hover:text-orange-300 transition-colors">🌅 Chhath Puja</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-festive tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 max-w-4xl drop-shadow-xs">
          {settings.sale_title || 'FESTIVAL MEGA SALE 2026'}
        </h1>

        {/* Subheading */}
        <p className="mt-3 sm:mt-4 text-base sm:text-xl lg:text-2xl font-medium text-amber-100/90 max-w-2xl text-balance">
          {settings.sale_subtitle || 'Celebrate More. Shop More. Save More.'}
        </p>

        {/* Description */}
        <p className="mt-3 text-xs sm:text-sm text-amber-200/70 max-w-xl text-balance">
          {settings.sale_description ||
            'Handpicked authentic festival deals on ethnic apparel, puja samagri, brassware, and festive gifts across India’s favorite shopping destinations.'}
        </p>

        {/* Countdown Timer */}
        <div className="mt-8">
          <CountdownTimer targetDate={settings.sale_end_date} />
        </div>

        {/* CTAs & Trust Badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onShopNow}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-xl hover:shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-slate-950" />
            <span>SHOP NOW</span>
            <ArrowDown className="w-4 h-4 text-slate-950 animate-bounce" />
          </button>
        </div>

        {/* Supported Shopping Platforms Trust Banner */}
        <div className="mt-10 pt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-amber-200/80">
          <span className="font-semibold uppercase tracking-wider text-amber-400">
            Verified Partner Deals:
          </span>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="font-bold text-white">Flipkart</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="font-bold text-white">Myntra</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
            <span className="font-bold text-white">Meesho</span>
          </div>
        </div>
      </div>
    </section>
  );
};

