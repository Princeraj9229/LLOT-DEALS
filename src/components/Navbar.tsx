import React, { useState } from 'react';
import { DiyaIcon } from './FestiveIcons';
import { Search, Shield, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  websiteName?: string;
  activeFestival: string;
  onSelectFestival: (festival: string) => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  websiteName = 'Utsav Mega Sale',
  activeFestival,
  onSelectFestival,
  onOpenAdmin,
  onOpenSearch,
  isAdminLoggedIn = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (fest: string, sectionId?: string) => {
    onSelectFestival(fest);
    setMobileMenuOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Brand Element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('all', 'hero-section')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <DiyaIcon size={24} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-festive block leading-tight">
                {websiteName}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 block">
                Festival Shopping 2026
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={() => handleNavClick('all', 'deals-section')}
            className={`transition-colors hover:text-amber-800 ${
              activeFestival === 'all' ? 'text-amber-700 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            All Deals
          </button>
          <button
            onClick={() => handleNavClick('durga_puja', 'deals-section')}
            className={`flex items-center gap-1.5 transition-colors hover:text-rose-700 ${
              activeFestival === 'durga_puja' ? 'text-rose-700 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            <span>🌺</span> Durga Puja
          </button>
          <button
            onClick={() => handleNavClick('diwali', 'deals-section')}
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-700 ${
              activeFestival === 'diwali' ? 'text-amber-700 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            <span>🪔</span> Diwali
          </button>
          <button
            onClick={() => handleNavClick('chhath_puja', 'deals-section')}
            className={`flex items-center gap-1.5 transition-colors hover:text-orange-700 ${
              activeFestival === 'chhath_puja' ? 'text-orange-700 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            <span>🌅</span> Chhath Puja
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-800 transition-colors"
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Search Products"
            aria-label="Search festival products"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Search</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs ${
              isAdminLoggedIn
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin'}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-amber-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white/98 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Festival Categories
          </div>
          <button
            onClick={() => handleNavClick('all', 'deals-section')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeFestival === 'all' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span>All Mega Sale Deals</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() => handleNavClick('durga_puja', 'deals-section')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeFestival === 'durga_puja' ? 'bg-rose-100 text-rose-900 font-semibold' : 'text-slate-700 hover:bg-rose-50'
            }`}
          >
            <span>🌺</span>
            <span>Durga Puja Special</span>
          </button>
          <button
            onClick={() => handleNavClick('diwali', 'deals-section')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeFestival === 'diwali' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span>🪔</span>
            <span>Diwali Dhamaka Deals</span>
          </button>
          <button
            onClick={() => handleNavClick('chhath_puja', 'deals-section')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activeFestival === 'chhath_puja' ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-slate-700 hover:bg-orange-50'
            }`}
          >
            <span>🌅</span>
            <span>Chhath Puja Collection</span>
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              How It Works & Affiliate Disclosure
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
