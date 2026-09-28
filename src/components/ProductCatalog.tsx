import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedFestival: string;
  onSelectFestival: (festival: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedFestival,
  onSelectFestival,
  searchQuery,
  onSearchChange,
  onSelectProduct,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.platform.toLowerCase().includes(q) ||
          p.festival.toLowerCase().includes(q)
      );
    }

    // Festival filter
    if (selectedFestival !== 'all') {
      list = list.filter((p) => p.festival === selectedFestival || p.festival === 'all');
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      list = list.filter((p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase());
    }

    // Price range
    if (priceRange === 'under_500') {
      list = list.filter((p) => p.sale_price < 500);
    } else if (priceRange === '500_1000') {
      list = list.filter((p) => p.sale_price >= 500 && p.sale_price <= 1000);
    } else if (priceRange === '1000_2000') {
      list = list.filter((p) => p.sale_price > 1000 && p.sale_price <= 2000);
    } else if (priceRange === 'above_2000') {
      list = list.filter((p) => p.sale_price > 2000);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.sale_price - b.sale_price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.sale_price - a.sale_price);
    } else if (sortBy === 'discount_desc') {
      list.sort((a, b) => b.discount - a.discount);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Featured
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return list;
  }, [products, searchQuery, selectedFestival, selectedPlatform, priceRange, sortBy]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedFestival !== 'all' ||
    selectedPlatform !== 'all' ||
    priceRange !== 'all' ||
    sortBy !== 'featured';

  const resetAllFilters = () => {
    onSearchChange('');
    onSelectFestival('all');
    setSelectedPlatform('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  return (
    <section id="deals-section" className="py-12 bg-slate-50/50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900">
              Browse All Festival Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Genuine deals directly from Flipkart, Myntra, and Meesho. Verified daily.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search kurti, diya, saree, thali..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toolbar (Segmented Controls) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Festival Segmented Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Festival:
              </span>
              <button
                onClick={() => onSelectFestival('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedFestival === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Festivals
              </button>
              <button
                onClick={() => onSelectFestival('durga_puja')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  selectedFestival === 'durga_puja'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🌺</span> Durga Puja
              </button>
              <button
                onClick={() => onSelectFestival('diwali')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  selectedFestival === 'diwali'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🪔</span> Diwali
              </button>
              <button
                onClick={() => onSelectFestival('chhath_puja')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                  selectedFestival === 'chhath_puja'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🌅</span> Chhath Puja
              </button>
            </div>

            {/* Desktop Quick Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Platform Selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">Platform:</span>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra">Myntra</option>
                  <option value="Meesho">Meesho</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">Price:</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under_500">Under ₹500</option>
                  <option value="500_1000">₹500 – ₹1,000</option>
                  <option value="1000_2000">₹1,000 – ₹2,000</option>
                  <option value="above_2000">Above ₹2,000</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                >
                  <option value="featured">Featured Deals</option>
                  <option value="discount_desc">Highest Discount</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Deals</option>
                </select>
              </div>

              {/* Reset button if active */}
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="p-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>
            Showing <strong className="text-slate-800 font-bold tabular-nums">{filteredProducts.length}</strong> festive deals
          </span>
          {searchQuery && (
            <span>
              Search for: <strong className="text-amber-800 font-semibold">"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {/* Product Grid: 2-column mobile, 3-column tablet, 4-column desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onCardClick={onSelectProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No festival deals match your filters</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, price range, or platform filters to discover more offers.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
