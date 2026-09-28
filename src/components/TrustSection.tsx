import React from 'react';
import { Search, MousePointerClick, ExternalLink, ShieldCheck, ShoppingBag, HeartHandshake } from 'lucide-react';
import { DiyaIcon } from './FestiveIcons';

export const TrustSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Browse Festival Products',
      desc: 'Explore curated festive selections for Durga Puja, Diwali, and Chhath Puja.',
      icon: <Search className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '02',
      title: 'Select Genuine Deals',
      desc: 'Compare price drops, discount percentages, and original retailer prices.',
      icon: <ShoppingBag className="w-6 h-6 text-rose-600" />,
    },
    {
      step: '03',
      title: 'Click Buy Now',
      desc: 'Click the Buy Now button on any product card to start your purchase.',
      icon: <MousePointerClick className="w-6 h-6 text-amber-600" />,
    },
    {
      step: '04',
      title: 'Secure Redirection',
      desc: 'You will be securely redirected directly to Flipkart, Myntra, or Meesho.',
      icon: <ExternalLink className="w-6 h-6 text-blue-600" />,
    },
    {
      step: '05',
      title: 'Complete Your Order Safely',
      desc: 'Place your order with standard delivery and official consumer protections.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
            <span>Complete Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900">
            How Utsav Mega Sale Works
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We are an affiliate shopping discovery portal designed to bring you the best verified festive discounts.
          </p>
        </div>

        {/* 5-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-amber-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-sm font-bold text-amber-800/40">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 font-festive">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Trust Notice Box */}
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-300/80 flex flex-col md:flex-row items-center gap-5 text-amber-950">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white shrink-0 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Affiliate Transparency Disclosure
            </h4>
            <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
              We are an affiliate shopping website. When you click “BUY NOW”, you will be redirected to the original shopping platform (Flipkart, Myntra, or Meesho) through our affiliate link. We do not collect customer addresses, process payments, or handle shipments on our website. All orders, transactions, and customer support are fulfilled directly by the respective e-commerce platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
