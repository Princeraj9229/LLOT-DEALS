import React from 'react';
import { DiyaIcon, DurgaPujaMotif, ChhathPujaSun } from './FestiveIcons';
import { GrandDurgaPratimaArtwork, DivineSuryaChhathArtwork } from './FestiveDivineArtwork';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FestivalCategoriesProps {
  activeFestival: string;
  onSelectFestival: (festival: string) => void;
}

export const FestivalCategories: React.FC<FestivalCategoriesProps> = ({
  activeFestival,
  onSelectFestival,
}) => {
  const categories = [
    {
      id: 'durga_puja',
      title: 'DURGA PUJA',
      tagline: 'Traditional & Trending Festival Picks',
      description: 'Lal paar sarees, brass dhunachi, terracotta jewellery & festive ethnic wear',
      icon: <DurgaPujaMotif size={36} className="text-rose-600" />,
      accentEmoji: '🌺',
      gradient: 'from-rose-600/10 via-red-50 to-orange-50/40',
      borderAccent: 'border-rose-300 hover:border-rose-500',
      badgeBg: 'bg-rose-100 text-rose-800',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
      artwork: <GrandDurgaPratimaArtwork className="w-full h-28 object-cover rounded-xl shadow-xs opacity-90 group-hover:scale-105 transition-transform duration-300" />,
    },
    {
      id: 'diwali',
      title: 'DIWALI',
      tagline: 'Diwali Shopping Deals',
      description: 'Artisanal brass diyas, fairy LED lights, pooja thalis & luxury gift hampers',
      icon: <DiyaIcon size={36} className="text-amber-600" />,
      accentEmoji: '🪔',
      gradient: 'from-amber-600/10 via-yellow-50 to-orange-50/40',
      borderAccent: 'border-amber-300 hover:border-amber-500',
      badgeBg: 'bg-amber-100 text-amber-900',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      artwork: (
        <div className="w-full h-28 rounded-xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 flex items-center justify-center relative overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent" />
          <div className="flex items-center gap-4 text-white">
            <DiyaIcon size={42} className="text-yellow-300 filter drop-shadow-md" />
            <DiyaIcon size={52} className="text-amber-200 filter drop-shadow-lg" />
            <DiyaIcon size={42} className="text-yellow-300 filter drop-shadow-md" />
          </div>
        </div>
      ),
    },
    {
      id: 'chhath_puja',
      title: 'CHHATH PUJA',
      tagline: 'Special Chhath Puja Collection',
      description: 'Handwoven bamboo soop & daura, pure brass kalash, thekua moulds & yellow sarees',
      icon: <ChhathPujaSun size={36} className="text-orange-600" />,
      accentEmoji: '🌅',
      gradient: 'from-orange-600/10 via-amber-50 to-yellow-50/40',
      borderAccent: 'border-orange-300 hover:border-orange-500',
      badgeBg: 'bg-orange-100 text-orange-900',
      buttonBg: 'bg-orange-600 hover:bg-orange-700 text-white',
      artwork: <DivineSuryaChhathArtwork className="w-full h-28 object-cover rounded-xl shadow-xs opacity-90 group-hover:scale-105 transition-transform duration-300" />,
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Grand Festive Collections</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-festive tracking-tight">
            Shop by Festival Celebrations
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Curated festive picks and mega discounts across Flipkart, Myntra, and Meesho for India’s biggest auspicious occasions.
          </p>
        </div>

        {/* 3 Large Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const isSelected = activeFestival === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectFestival(cat.id);
                  const el = document.getElementById('deals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative group flex flex-col justify-between p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  cat.borderAccent
                } ${cat.gradient} ${
                  isSelected
                    ? 'ring-4 ring-amber-400/50 shadow-xl scale-[1.02]'
                    : 'shadow-sm hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Decorative background glow circle */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/60 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div>
                  {/* Top Artwork Banner */}
                  <div className="mb-4 overflow-hidden rounded-xl border border-black/5">
                    {cat.artwork}
                  </div>

                  {/* Top icon and tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.8 rounded-md ${cat.badgeBg}`}>
                      {cat.tagline}
                    </span>
                    <span className="text-xl select-none">{cat.accentEmoji}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-festive mt-2 group-hover:text-amber-900 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                    {isSelected ? 'Currently Viewing' : 'Explore Collection'}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isSelected ? cat.buttonBg : 'bg-white text-slate-700 shadow-2xs group-hover:bg-amber-600 group-hover:text-white'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

