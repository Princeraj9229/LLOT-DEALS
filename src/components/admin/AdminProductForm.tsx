import React, { useState, useRef } from 'react';
import { Product, Festival, Platform } from '../../types';
import { api } from '../../lib/api';
import {
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Check,
  AlertCircle,
  Wand2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { PlatformBadge, DiyaIcon } from '../FestiveIcons';

interface AdminProductFormProps {
  initialProduct?: Product | null;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

// Preset festival images ready to use in 1 click
const FESTIVAL_IMAGE_PRESETS = [
  {
    name: '🪔 Brass Diyas',
    festival: 'diwali',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🌺 Lal Paar Saree',
    festival: 'durga_puja',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🌅 Bamboo Soop & Daura',
    festival: 'chhath_puja',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🪔 Zari Anarkali Kurta',
    festival: 'diwali',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🌅 Brass Surya Kalash',
    festival: 'chhath_puja',
    url: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🌺 Brass Dhunachi',
    festival: 'durga_puja',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🪔 LED Fairy Lights',
    festival: 'diwali',
    url: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: '🌅 Yellow Vrat Saree',
    festival: 'chhath_puja',
    url: 'https://images.unsplash.com/photo-1610030469668-932d0f5c1d1a?auto=format&fit=crop&w=600&q=80',
  },
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialProduct,
  onSuccess,
  onCancel,
}) => {
  const isEditing = Boolean(initialProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialProduct?.name || '');
  const [image, setImage] = useState(initialProduct?.image || '');
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialProduct ? String(initialProduct.original_price) : ''
  );
  const [salePrice, setSalePrice] = useState<string>(
    initialProduct ? String(initialProduct.sale_price) : ''
  );
  const [festival, setFestival] = useState<Festival>(initialProduct?.festival || 'diwali');
  const [platform, setPlatform] = useState<Platform>(initialProduct?.platform || 'Flipkart');
  const [affiliateUrl, setAffiliateUrl] = useState(initialProduct?.affiliate_url || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [active, setActive] = useState<boolean>(initialProduct ? initialProduct.active : true);
  const [featured, setFeatured] = useState<boolean>(initialProduct ? initialProduct.featured : false);
  const [limitedTime, setLimitedTime] = useState<boolean>(
    initialProduct ? initialProduct.limited_time : false
  );

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatic discount calculation
  const calculatedDiscount = React.useMemo(() => {
    const orig = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    if (!isNaN(orig) && !isNaN(sale) && orig > 0 && sale >= 0 && orig >= sale) {
      return Math.round(((orig - sale) / orig) * 100);
    }
    return 0;
  }, [originalPrice, salePrice]);

  // Quick Affiliate URL Inspector: Detect platform if pasted
  const handleAffiliateUrlChange = (val: string) => {
    setAffiliateUrl(val);
    const lower = val.toLowerCase();
    if (lower.includes('flipkart.com') || lower.includes('fkrt.it')) {
      setPlatform('Flipkart');
    } else if (lower.includes('myntra.com') || lower.includes('myntr.it')) {
      setPlatform('Myntra');
    } else if (lower.includes('meesho.com') || lower.includes('meesho.app')) {
      setPlatform('Meesho');
    }
  };

  // 1-Click Link Auto-Extractor: Extracts product name, image, and platform
  const handleAutoExtract = async () => {
    const targetUrl = affiliateUrl.trim() || image.trim();
    if (!targetUrl) {
      setError('Please paste a product/affiliate link first to extract details');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractSuccessMsg(null);

    try {
      const data = await api.extractProductInfo(targetUrl);
      if (data.name && !name) setName(data.name);
      if (data.image) {
        setImage(data.image);
        setImagePreviewError(false);
      }
      if (data.platform) setPlatform(data.platform);
      if (data.description && !description) setDescription(data.description);
      if (!affiliateUrl) setAffiliateUrl(targetUrl);

      if (data.image) {
        setExtractSuccessMsg('Product details and image extracted successfully!');
      } else {
        setExtractSuccessMsg('Link analyzed. If product image did not appear, you can pick a preset or upload from device below.');
      }
    } catch (err: any) {
      setError('Could not auto-fetch image. You can upload an image or choose a preset below.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle Local Image File Upload (from phone/PC)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP)');
      return;
    }

    // Convert file to Base64 Data URL so it is 100% reliable and permanent
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setImage(base64);
        setImagePreviewError(false);
        setExtractSuccessMsg('Image uploaded successfully from your device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const orig = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);

    if (isNaN(orig) || orig <= 0) {
      setError('Please provide a valid original price');
      return;
    }
    if (isNaN(sale) || sale < 0) {
      setError('Please provide a valid sale price');
      return;
    }
    if (sale > orig) {
      setError('Sale price cannot exceed original price');
      return;
    }
    if (!affiliateUrl.trim()) {
      setError('Affiliate URL is required');
      return;
    }

    setLoading(true);

    try {
      const payload: Partial<Product> = {
        name: name.trim(),
        image:
          image.trim() ||
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        original_price: orig,
        sale_price: sale,
        discount: calculatedDiscount,
        festival,
        platform,
        affiliate_url: affiliateUrl.trim(),
        description: description.trim(),
        active,
        featured,
        limited_time: limitedTime,
      };

      let result: Product;
      if (isEditing && initialProduct) {
        result = await api.updateProduct(initialProduct.id, payload);
      } else {
        result = await api.createProduct(payload);
      }

      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-festive text-slate-900">
            {isEditing ? 'Edit Festival Product' : 'Add New Festival Product'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste affiliate link or upload image. Product updates immediately on the live website.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>

      {/* Auto-Extract Fast Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-300">
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="w-4 h-4 text-amber-700" />
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            Auto-Extract from Product Link (Flipkart / Myntra / Meesho)
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={affiliateUrl}
            onChange={(e) => handleAffiliateUrlChange(e.target.value)}
            placeholder="Paste Flipkart / Myntra / Meesho product or affiliate link here..."
            className="flex-1 px-3.5 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleAutoExtract}
            disabled={isExtracting || !affiliateUrl.trim()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extract Image & Info</span>
              </>
            )}
          </button>
        </div>
        {extractSuccessMsg && (
          <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{extractSuccessMsg}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pure Brass Kuber Diya Set (Pack of 12)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            {/* Price & Auto-Discount Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Original Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="1499"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Sale Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="699"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Discount (%)
                </label>
                <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-800 text-center font-mono tabular-nums">
                  {calculatedDiscount}% OFF
                </div>
              </div>
            </div>

            {/* Festival & Platform selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Festival <span className="text-rose-500">*</span>
                </label>
                <select
                  value={festival}
                  onChange={(e) => setFestival(e.target.value as Festival)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="diwali">🪔 Diwali</option>
                  <option value="durga_puja">🌺 Durga Puja</option>
                  <option value="chhath_puja">🌅 Chhath Puja</option>
                  <option value="all">✨ All Festivals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Shopping Platform <span className="text-rose-500">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                >
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra">Myntra</option>
                  <option value="Meesho">Meesho</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Affiliate Target URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  required
                  value={affiliateUrl}
                  onChange={(e) => handleAffiliateUrlChange(e.target.value)}
                  placeholder="https://www.flipkart.com/?affid=..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product highlights, material details, and key festive features..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Right Column: Image Management & Live Preview */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Image (URL or Upload)
              </label>

              {/* URL Input */}
              <div className="relative mb-2">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setImagePreviewError(false);
                  }}
                  placeholder="Paste image URL or use buttons below..."
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>

              {/* Device File Upload & Preset Options */}
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Upload from Phone / PC</span>
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Or pick a verified festive image preset:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {FESTIVAL_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImage(preset.url);
                        setImagePreviewError(false);
                        setExtractSuccessMsg(`Applied ${preset.name} image!`);
                      }}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-medium text-left truncate transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Image Preview Box */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Live Image Preview
              </span>
              <div className="relative aspect-16/10 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
                {image && !imagePreviewError ? (
                  <img
                    src={image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                    <DiyaIcon size={32} className="text-amber-500 mb-1 opacity-70" />
                    <span className="text-xs font-medium text-slate-600">
                      {imagePreviewError
                        ? 'Image could not load from direct URL. Click "Upload from Phone/PC" or pick a preset above!'
                        : 'No image selected yet.'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Feature Toggles */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Product Status</span>
                  <span className="text-[11px] text-slate-500">
                    {active ? 'Visible on public store' : 'Hidden from visitors'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      active ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      !active ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Hidden
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">🔥 Featured (Trending)</span>
                  <span className="text-[11px] text-slate-500">Showcase in Trending Deals</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">⚡ Limited-Time Deal</span>
                  <span className="text-[11px] text-slate-500">Showcase in Limited Time Deals</span>
                </div>
                <input
                  type="checkbox"
                  checked={limitedTime}
                  onChange={(e) => setLimitedTime(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
