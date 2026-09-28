import React, { useState } from 'react';
import { Product } from '../types';
import { PlatformBadge, DiyaIcon } from './FestiveIcons';
import { ExternalLink, Tag, Sparkles, Flame, Zap } from 'lucide-react';
import { api } from '../lib/api';

interface ProductCardProps {
  product: Product;
  onCardClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCardClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [triedProxy, setTriedProxy] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Sync if product image changes
  React.useEffect(() => {
    setImgSrc(product.image);
    setImageError(false);
    setImageLoaded(false);
    setTriedProxy(false);
  }, [product.image]);

  const handleImageError = () => {
    // If it's a remote URL and hasn't tried proxy yet, try fetching through proxy
    if (
      !triedProxy &&
      imgSrc &&
      imgSrc.startsWith('http') &&
      !imgSrc.includes('/api/image-proxy')
    ) {
      setTriedProxy(true);
      setImgSrc(`/api/image-proxy?url=${encodeURIComponent(imgSrc)}`);
    } else {
      setImageError(true);
    }
  };

  const festivalLabel = {
    diwali: 'Diwali Special',
    durga_puja: 'Durga Puja Pick',
    chhath_puja: 'Chhath Puja Holy Collection',
    all: 'Festival Special',
  }[product.festival];

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRedirecting(true);

    try {
      // Record click asynchronously in database
      api.recordClick(product.id).catch((err) => console.error('Click logging error:', err));
    } catch {
      // non-blocking
    }

    // Open affiliate link in new tab without tampering parameters
    setTimeout(() => {
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
      setIsRedirecting(false);
    }, 150);
  };

  return (
    <article
      onClick={() => onCardClick?.(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-amber-100 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {/* Platform Badge */}
        <PlatformBadge platform={product.platform} />

        <div className="flex items-center gap-1">
          {product.is_demo && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-amber-200 backdrop-blur-xs">
              DEMO PRODUCT
            </span>
          )}
          {product.featured && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white shadow-xs">
              <Flame className="w-3 h-3 fill-current" />
              <span>Trending</span>
            </span>
          )}
          {product.limited_time && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white shadow-xs">
              <Zap className="w-3 h-3 fill-current" />
              <span>Deal</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Image Area */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-amber-50/50 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Fallback container if image fails or loading */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-amber-800">
            <DiyaIcon size={36} className="text-amber-600 mb-2 opacity-80" />
            <span className="text-xs font-semibold text-center line-clamp-2 px-2 text-amber-900">
              {product.name}
            </span>
            <span className="text-[10px] text-amber-700/80 mt-1 uppercase tracking-wide">
              {product.platform} Verified Deal
            </span>
          </div>
        )}

        {/* Discount corner badge */}
        {product.discount > 0 && (
          <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
        <div>
          {/* Metadata line per zero-pill discipline */}
          <div className="flex items-center gap-1.5 text-[11px] text-amber-800/80 font-medium mb-1 truncate">
            <span>{festivalLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.platform}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>

          {/* Description snippet if available */}
          {product.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          {/* Price Row */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums">
                ₹{product.sale_price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.sale_price && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              on {product.platform}
            </span>
          </div>

          {/* Buy Now CTA */}
          <button
            onClick={handleBuyNow}
            disabled={isRedirecting}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-xs focus:ring-2 focus:ring-amber-500/50 ${
              product.platform === 'Flipkart'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : product.platform === 'Myntra'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white'
            }`}
          >
            <span>{isRedirecting ? 'Redirecting...' : 'BUY NOW'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
