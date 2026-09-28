import React, { useState } from 'react';
import { Product } from '../types';
import { PlatformBadge, DiyaIcon } from './FestiveIcons';
import { X, ExternalLink, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(product?.image || '');
  const [triedProxy, setTriedProxy] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  React.useEffect(() => {
    if (product) {
      setImgSrc(product.image);
      setImageError(false);
      setTriedProxy(false);
    }
  }, [product]);

  const handleImageError = () => {
    if (!triedProxy && imgSrc && imgSrc.startsWith('http') && !imgSrc.includes('/api/image-proxy')) {
      setTriedProxy(true);
      setImgSrc(`/api/image-proxy?url=${encodeURIComponent(imgSrc)}`);
    } else {
      setImageError(true);
    }
  };

  if (!product) return null;

  const handleBuyNow = () => {
    setIsRedirecting(true);
    api.recordClick(product.id).catch(() => {});
    setTimeout(() => {
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
      setIsRedirecting(false);
    }, 150);
  };

  const festivalLabel = {
    diwali: 'Diwali Special',
    durga_puja: 'Durga Puja Pick',
    chhath_puja: 'Chhath Puja Holy Collection',
    all: 'Festival Special',
  }[product.festival];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-amber-200 relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-amber-50/50 flex items-center justify-center relative min-h-[260px] md:min-h-[380px]">
          {!imageError ? (
            <img
              src={imgSrc}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover max-h-[320px] md:max-h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-amber-800 text-center">
              <DiyaIcon size={48} className="text-amber-600 mb-2" />
              <span className="text-sm font-semibold">{product.name}</span>
            </div>
          )}

          {product.discount > 0 && (
            <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PlatformBadge platform={product.platform} />
              <span className="text-xs text-amber-800 font-medium">
                {festivalLabel}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-festive leading-snug">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                ₹{product.sale_price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.sale_price && (
                <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded ml-auto">
                Save ₹{(product.original_price - product.sale_price).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description || 'Celebrate with this authentic festive item. High quality, festive craft and verified merchant delivery.'}
              </p>
            </div>

            {/* Platform disclaimer */}
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Clicking BUY NOW safely opens this offer directly on {product.platform}. Complete your purchase with standard consumer return and warranty policies.
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={handleBuyNow}
              disabled={isRedirecting}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white shadow-md transition-all cursor-pointer ${
                product.platform === 'Flipkart'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : product.platform === 'Myntra'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-fuchsia-700 hover:bg-fuchsia-800'
              }`}
            >
              <span>{isRedirecting ? 'Redirecting to ' + product.platform + '...' : `BUY NOW ON ${product.platform.toUpperCase()}`}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
