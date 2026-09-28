import React, { useState } from 'react';
import { SaleSettings } from '../types';
import { DiyaIcon } from './FestiveIcons';
import { Mail, Phone, ExternalLink, ShieldCheck, X } from 'lucide-react';

interface FooterProps {
  settings: SaleSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <DiyaIcon size={22} className="text-white" />
              </div>
              <span className="text-lg font-bold font-festive text-white tracking-tight">
                {settings.website_name || 'Utsav Mega Sale'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              India's premier festive shopping discovery platform. Handpicking genuine discount offers across Flipkart, Myntra, and Meesho for Durga Puja, Diwali, and Chhath Puja.
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-400 font-semibold">
              <span>🪔 Diwali</span>
              <span>•</span>
              <span>🌺 Durga Puja</span>
              <span>•</span>
              <span>🌅 Chhath Puja</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Festival Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#deals-section" className="hover:text-amber-400 transition-colors">
                  Diwali Mega Offers (Diyas, Mandir & Ethnic)
                </a>
              </li>
              <li>
                <a href="#deals-section" className="hover:text-amber-400 transition-colors">
                  Durga Puja Lal Paar Sarees & Dhunachi
                </a>
              </li>
              <li>
                <a href="#deals-section" className="hover:text-amber-400 transition-colors">
                  Chhath Puja Soop, Daura & Brass Kalash
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How Affiliate Shopping Works
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveModal('disclosure')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('about')}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  About Our Platform
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact & Updates
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              {settings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>{settings.contact_email}</span>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{settings.contact_phone}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
                Join Festive Deal Alerts
              </span>
              <div className="flex items-center gap-2">
                {settings.social_telegram && (
                  <a
                    href={settings.social_telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-amber-300 border border-slate-700 hover:border-amber-500 transition-colors"
                  >
                    Telegram
                  </a>
                )}
                {settings.social_whatsapp && (
                  <a
                    href={settings.social_whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-emerald-400 border border-slate-700 hover:border-emerald-500 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {settings.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] text-rose-400 border border-slate-700 hover:border-rose-500 transition-colors"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.website_name || 'Utsav Mega Sale'}. All Rights Reserved.</p>
          <p className="text-[11px] text-slate-600">
            All merchant trademarks & logos belong to their respective owners (Flipkart, Myntra, Meesho).
          </p>
        </div>
      </div>

      {/* Policy Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'disclosure' && (
              <div>
                <h3 className="text-lg font-bold font-festive text-slate-900 mb-3">
                  Affiliate Disclosure
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    {settings.website_name || 'Utsav Mega Sale'} is a participant in affiliate marketing programs designed to provide a means for websites to earn referral fees by linking to official Indian e-commerce platforms including Flipkart, Myntra, and Meesho.
                  </p>
                  <p>
                    When you click on links to various merchants on this site and make a qualifying purchase, this can result in this site earning a commission. This comes at <strong>no additional cost to you</strong>.
                  </p>
                  <p>
                    We do not sell products directly, collect payment details, or store your personal credit/debit card information. All transactions and deliveries are fulfilled by Flipkart, Myntra, or Meesho.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-lg font-bold font-festive text-slate-900 mb-3">
                  Privacy Policy
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Your privacy is important to us. We only record anonymous outbound click metrics (product ID and timestamp) to analyze which festival deals are most popular.
                  </p>
                  <p>
                    We do NOT collect visitor personal names, addresses, credit cards, or phone numbers. When you click "BUY NOW", you are transferred directly to the respective shopping platform where their privacy policy governs.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <h3 className="text-lg font-bold font-festive text-slate-900 mb-3">
                  Terms & Conditions
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    Prices and availability of products are subject to change on the merchant's store at any time. We strive to maintain accurate pricing, but final price and stock must be confirmed on the seller's website.
                  </p>
                  <p>
                    By using this website, you acknowledge that any order dispute, return, or refund must be settled with the merchant from which the product was purchased.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'about' && (
              <div>
                <h3 className="text-lg font-bold font-festive text-slate-900 mb-3">
                  About {settings.website_name || 'Utsav Mega Sale'}
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                  <p>
                    {settings.website_name || 'Utsav Mega Sale'} was created with a mission to bring together authentic festival essentials across India's beloved celebrations: Diwali, Durga Puja, and Chhath Puja.
                  </p>
                  <p>
                    Instead of spending hours searching through multiple apps, our platform curates high-discount offers so families can celebrate more and save more!
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
