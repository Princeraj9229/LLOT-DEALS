import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Zap } from 'lucide-react';

interface LimitedDealsSectionProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const LimitedDealsSection: React.FC<LimitedDealsSectionProps> = ({
  products,
  onSelectProduct,
}) => {
  const limitedDeals = products.filter((p) => p.limited_time);

  if (limitedDeals.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-rose-600 fill-current" />
              <span>Flash Festival Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900 flex items-center gap-2">
              <span>⚡ LIMITED TIME FESTIVAL DEALS</span>
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Steal deals valid for a limited period on Flipkart, Myntra, and Meesho.
            </p>
          </div>
          <span className="text-xs font-medium text-rose-600 font-mono">
            {limitedDeals.length} active deals available
          </span>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {limitedDeals.map((product) => (
            <ProductCard key={product.id} product={product} onCardClick={onSelectProduct} />
          ))}
        </div>
      </div>
    </section>
  );
};
