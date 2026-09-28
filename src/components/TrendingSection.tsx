import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Flame, Sparkles } from 'lucide-react';

interface TrendingSectionProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ products, onSelectProduct }) => {
  const trendingProducts = products.filter((p) => p.featured);

  if (trendingProducts.length === 0) return null;

  return (
    <section className="py-12 bg-amber-50/40 border-y border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-current" />
              <span>Handpicked & Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900 flex items-center gap-2">
              <span>🔥 TRENDING FESTIVAL DEALS</span>
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              The most loved festival essentials with highest verified customer ratings and discounts.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Showing {trendingProducts.length} curated picks
          </span>
        </div>

        {/* Responsive Grid: 2-col on mobile, 3-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} onCardClick={onSelectProduct} />
          ))}
        </div>
      </div>
    </section>
  );
};
