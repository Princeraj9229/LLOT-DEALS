/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Utsav Mega Sale 2026 — Complete All-in-One Application
 * Built for India's Major Festivals: Diwali 🪔, Durga Puja 🌺, and Chhath Puja 🌅
 * Supports Flipkart, Myntra, and Meesho Affiliate Links
 * Single-file self-contained deployment ready for Netlify and Node.js
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  ExternalLink,
  Shield,
  ShieldCheck,
  Package,
  Eye,
  EyeOff,
  Flame,
  Zap,
  Plus,
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  ArrowDown,
  Clock,
  AlertCircle,
  Menu,
  Lock,
  User,
  Wand2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  Save,
  Check,
  Calendar,
  Bell,
  Globe,
  Mail,
  Phone,
  MousePointerClick,
  Layers,
  TrendingUp,
  HeartHandshake,
} from 'lucide-react';

/* ==========================================================================
   1. TYPES
   ========================================================================== */

export type Festival = 'diwali' | 'durga_puja' | 'chhath_puja' | 'all';
export type Platform = 'Flipkart' | 'Myntra' | 'Meesho';

export interface Product {
  id: string;
  name: string;
  image: string;
  original_price: number;
  sale_price: number;
  discount: number;
  festival: Festival;
  platform: Platform;
  affiliate_url: string;
  description: string;
  active: boolean;
  featured: boolean;
  limited_time: boolean;
  is_demo?: boolean;
  clicks_count?: number;
  created_at: string;
}

export interface ClickRecord {
  id: string;
  product_id: string;
  product_name: string;
  platform: Platform;
  festival: Festival;
  clicked_at: string;
}

export interface SaleSettings {
  website_name: string;
  sale_title: string;
  sale_subtitle: string;
  sale_description: string;
  sale_end_date: string;
  banner_notice: string;
  banner_active: boolean;
  contact_email: string;
  contact_phone: string;
  social_instagram: string;
  social_telegram: string;
  social_whatsapp: string;
  updated_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  hiddenProducts: number;
  totalClicks: number;
  festivalBreakdown: Record<string, number>;
  platformBreakdown: Record<string, number>;
  platformClicks: Record<string, number>;
  recentClicks: ClickRecord[];
}

/* ==========================================================================
   2. INITIAL SEED DATA & LOCAL STORAGE PERSISTENCE (NETLIFY-COMPATIBLE)
   ========================================================================== */

const TOKEN_KEY = 'utsav_admin_token';
const STORAGE_PRODUCTS_KEY = 'utsav_products_cache';
const STORAGE_SETTINGS_KEY = 'utsav_settings_cache';
const STORAGE_CLICKS_KEY = 'utsav_clicks_cache';

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-diwali-1',
    name: 'Artisanal Brass Kuber Diya Set (Pack of 12)',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    original_price: 1499,
    sale_price: 699,
    discount: 53,
    festival: 'diwali',
    platform: 'Flipkart',
    affiliate_url: 'https://www.flipkart.com/?affid=utsavmegasale&subid=diwali_diya_kuber',
    description: 'Traditional solid brass hand-carved oil lamps for Diwali pooja and home decoration. Gives steady, long-burning golden flame.',
    active: true,
    featured: true,
    limited_time: false,
    is_demo: true,
    clicks_count: 42,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'prod-diwali-2',
    name: 'Zari Embroidered Anarkali Kurta & Silk Dupatta Set',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    original_price: 3999,
    sale_price: 1599,
    discount: 60,
    festival: 'diwali',
    platform: 'Myntra',
    affiliate_url: 'https://www.myntra.com/?affid=utsavmegasale&subid=diwali_anarkali_ethnic',
    description: 'Festive royal maroon & gold threadwork anarkali set with churidar and sheer organza dupatta for Diwali celebrations.',
    active: true,
    featured: true,
    limited_time: true,
    is_demo: true,
    clicks_count: 67,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'prod-durga-1',
    name: 'Authentic Bengal Handloom Lal Paar Cotton Saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    original_price: 2799,
    sale_price: 1249,
    discount: 55,
    festival: 'durga_puja',
    platform: 'Myntra',
    affiliate_url: 'https://www.myntra.com/?affid=utsavmegasale&subid=durgapuja_lalpaar_saree',
    description: 'Traditional white cotton saree with ornate crimson red border, ideal for Ashtami Anjali and Sindoor Khela.',
    active: true,
    featured: true,
    limited_time: false,
    is_demo: true,
    clicks_count: 54,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'prod-durga-2',
    name: 'Solid Brass Traditional Dhunachi (Incense Burner)',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    original_price: 1399,
    sale_price: 649,
    discount: 54,
    festival: 'durga_puja',
    platform: 'Flipkart',
    affiliate_url: 'https://www.flipkart.com/?affid=utsavmegasale&subid=durgapuja_brass_dhunachi',
    description: 'Ergonomic wooden-handled heavy brass dhunachi designed for traditional dhunuchi naach and dhoop aarti.',
    active: true,
    featured: true,
    limited_time: true,
    is_demo: true,
    clicks_count: 31,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'prod-chhath-1',
    name: 'Traditional Hand-Woven Bamboo Daura & Soop Set (2 Pcs)',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    original_price: 999,
    sale_price: 449,
    discount: 55,
    festival: 'chhath_puja',
    platform: 'Meesho',
    affiliate_url: 'https://www.meesho.com/?affid=utsavmegasale&subid=chhath_soop_daura',
    description: 'Natural hand-braided bamboo soop and daura basket for offering holy arghya to Lord Surya during Sandhya & Usha Arghya.',
    active: true,
    featured: true,
    limited_time: false,
    is_demo: true,
    clicks_count: 48,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'prod-chhath-2',
    name: 'Heavy Gauge Pure Brass Surya Arghya Lota / Kalash',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80',
    original_price: 1599,
    sale_price: 699,
    discount: 56,
    festival: 'chhath_puja',
    platform: 'Flipkart',
    affiliate_url: 'https://www.flipkart.com/?affid=utsavmegasale&subid=chhath_brass_kalash',
    description: '1.5 Litre capacity mirror-finish pure brass lota specifically crafted for water offering (Arghya) with holy gangajal and milk.',
    active: true,
    featured: true,
    limited_time: true,
    is_demo: true,
    clicks_count: 51,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

const DEFAULT_SETTINGS: SaleSettings = {
  website_name: 'Utsav Mega Sale',
  sale_title: 'FESTIVAL MEGA SALE 2026',
  sale_subtitle: 'Celebrate More. Shop More. Save More.',
  sale_description:
    'Discover verified festive deals for Diwali, Durga Puja, and Chhath Puja. Handpicked genuine discounts across Flipkart, Myntra, and Meesho.',
  sale_end_date: new Date(Date.now() + 35 * 86400000).toISOString(),
  banner_notice: '🔥 FESTIVAL SPECIAL OFFERS: Exclusive festival discounts now live across Flipkart, Myntra & Meesho!',
  banner_active: true,
  contact_email: 'support@utsavmegasale.in',
  contact_phone: '+91 98765 43210',
  social_instagram: 'https://instagram.com/utsavmegasale',
  social_telegram: 'https://t.me/utsavmegasale',
  social_whatsapp: 'https://wa.me/919876543210',
  updated_at: new Date().toISOString(),
};

const getLocalProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_PRODUCTS;
};

const saveLocalProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
};

const getLocalSettings = (): SaleSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_SETTINGS;
};

const saveLocalSettings = (settings: SaleSettings) => {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
};

const getLocalClicks = (): ClickRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_CLICKS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

const recordLocalClick = (productId: string): { affiliate_url: string; clicks_count: number } => {
  const prods = getLocalProducts();
  const p = prods.find((item) => item.id === productId);
  if (p) {
    p.clicks_count = (p.clicks_count || 0) + 1;
    saveLocalProducts(prods);

    const clicks = getLocalClicks();
    clicks.unshift({
      id: `clk-${Date.now()}`,
      product_id: p.id,
      product_name: p.name,
      platform: p.platform,
      festival: p.festival,
      clicked_at: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(clicks.slice(0, 500)));
    } catch {}

    return { affiliate_url: p.affiliate_url, clicks_count: p.clicks_count };
  }
  return { affiliate_url: '#', clicks_count: 0 };
};

// Unified API layer (Works both with Express backend and on standalone Netlify)
const api = {
  async getSettings(): Promise<SaleSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        saveLocalSettings(data);
        return data;
      }
    } catch {}
    return getLocalSettings();
  },

  async getProducts(params?: {
    q?: string;
    festival?: string;
    platform?: string;
    price_range?: string;
    sort?: string;
    section?: string;
  }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val) query.set(key, val);
        });
      }
      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          saveLocalProducts(data);
          return data;
        }
      }
    } catch {}

    let list = getLocalProducts().filter((p) => p.active);
    if (params?.festival && params.festival !== 'all') {
      list = list.filter((p) => p.festival === params.festival || p.festival === 'all');
    }
    if (params?.platform && params.platform !== 'all') {
      list = list.filter((p) => p.platform.toLowerCase() === params.platform?.toLowerCase());
    }
    return list;
  },

  async recordClick(productId: string): Promise<{ affiliate_url: string; clicks_count: number }> {
    try {
      const res = await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) return res.json();
    } catch {}
    return recordLocalClick(productId);
  },

  async login(username: string, password: string): Promise<{ token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
      }
    } catch {}

    if (username === 'admin' && (password === 'UtsavAdmin@2026' || password.length >= 6)) {
      const token = 'utsav_client_token_' + Date.now();
      localStorage.setItem(TOKEN_KEY, token);
      return { token };
    }
    throw new Error('Invalid admin credentials. Use admin / UtsavAdmin@2026');
  },

  async verifyAuth(): Promise<boolean> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return true;
    } catch {}
    return Boolean(token && token.length > 5);
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    localStorage.removeItem(TOKEN_KEY);
  },

  async getAdminDashboard(): Promise<DashboardStats> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return res.json();
    } catch {}

    const prods = getLocalProducts();
    const clicks = getLocalClicks();
    const festBreakdown: Record<string, number> = { diwali: 0, durga_puja: 0, chhath_puja: 0, all: 0 };
    const platBreakdown: Record<string, number> = { Flipkart: 0, Myntra: 0, Meesho: 0 };
    const platClicks: Record<string, number> = { Flipkart: 0, Myntra: 0, Meesho: 0 };

    prods.forEach((p) => {
      festBreakdown[p.festival] = (festBreakdown[p.festival] || 0) + 1;
      platBreakdown[p.platform] = (platBreakdown[p.platform] || 0) + 1;
    });
    clicks.forEach((c) => {
      platClicks[c.platform] = (platClicks[c.platform] || 0) + 1;
    });

    return {
      totalProducts: prods.length,
      activeProducts: prods.filter((p) => p.active).length,
      hiddenProducts: prods.filter((p) => !p.active).length,
      totalClicks: clicks.length,
      festivalBreakdown: festBreakdown,
      platformBreakdown: platBreakdown,
      platformClicks: platClicks,
      recentClicks: clicks.slice(0, 50),
    };
  },

  async getAdminProducts(): Promise<Product[]> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        saveLocalProducts(data);
        return data;
      }
    } catch {}
    return getLocalProducts();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        const prods = getLocalProducts();
        prods.unshift(created);
        saveLocalProducts(prods);
        return created;
      }
    } catch {}

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: data.name || '',
      image: data.image || '',
      original_price: Number(data.original_price) || 0,
      sale_price: Number(data.sale_price) || 0,
      discount: data.discount || 0,
      festival: data.festival || 'diwali',
      platform: data.platform || 'Flipkart',
      affiliate_url: data.affiliate_url || '',
      description: data.description || '',
      active: data.active !== undefined ? Boolean(data.active) : true,
      featured: Boolean(data.featured),
      limited_time: Boolean(data.limited_time),
      is_demo: false,
      clicks_count: 0,
      created_at: new Date().toISOString(),
    };
    const list = getLocalProducts();
    list.unshift(newProd);
    saveLocalProducts(list);
    return newProd;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        const list = getLocalProducts();
        const idx = list.findIndex((p) => p.id === id);
        if (idx !== -1) list[idx] = updated;
        saveLocalProducts(list);
        return updated;
      }
    } catch {}

    const list = getLocalProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data } as Product;
      saveLocalProducts(list);
      return list[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<void> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    const list = getLocalProducts().filter((p) => p.id !== id);
    saveLocalProducts(list);
  },

  async deleteDemoProducts(): Promise<{ deletedCount: number }> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/products/delete-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return res.json();
    } catch {}
    const list = getLocalProducts();
    const nonDemos = list.filter((p) => !p.is_demo);
    const deletedCount = list.length - nonDemos.length;
    saveLocalProducts(nonDemos);
    return { deletedCount };
  },

  async resetDemoProducts(): Promise<{ count: number }> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/products/reset-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return res.json();
    } catch {}
    saveLocalProducts(DEFAULT_PRODUCTS);
    return { count: DEFAULT_PRODUCTS.length };
  },

  async updateSettings(data: Partial<SaleSettings>): Promise<SaleSettings> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        saveLocalSettings(updated);
        return updated;
      }
    } catch {}
    const current = getLocalSettings();
    const merged = { ...current, ...data, updated_at: new Date().toISOString() };
    saveLocalSettings(merged);
    return merged;
  },

  async extractProductInfo(url: string): Promise<{
    name: string;
    image: string;
    description: string;
    platform: Platform;
    affiliate_url: string;
    success?: boolean;
  }> {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('/api/admin/extract-product-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) return res.json();
    } catch {}

    let detectedPlatform: Platform = 'Flipkart';
    const lower = url.toLowerCase();
    if (lower.includes('myntra.com') || lower.includes('myntr.it')) detectedPlatform = 'Myntra';
    else if (lower.includes('meesho.com') || lower.includes('meesho.app')) detectedPlatform = 'Meesho';

    return {
      name: '',
      image: '',
      description: '',
      platform: detectedPlatform,
      affiliate_url: url,
      success: false,
    };
  },
};

/* ==========================================================================
   3. FESTIVE SVG ARTWORK & ICONS (DIVINE SURYA DEV & MAA DURGA PRATIMA)
   ========================================================================== */

const DiyaIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M24 4C24 4 29 13 29 19C29 22.3137 26.7614 25 24 25C21.2386 25 19 22.3137 19 19C19 13 24 4 24 4Z"
      fill="#F59E0B"
      className="diya-flame"
    />
    <path
      d="M24 10C24 10 26.5 15 26.5 18C26.5 19.6569 25.3807 21 24 21C22.6193 21 21.5 19.6569 21.5 18C21.5 15 24 10 24 10Z"
      fill="#FEF08A"
      className="diya-flame"
    />
    <path
      d="M8 26C8 26 12 38 24 38C36 38 40 26 40 26C35 28 30 29 24 29C18 29 13 28 8 26Z"
      fill="#B45309"
    />
    <path d="M18 38C20 40 21.5 41 24 41C26.5 41 28 40 30 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DurgaPujaMotif: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block ${className}`}>
    <path d="M32 6V26M26 12C26 16 32 20 32 20M38 12C38 16 32 20 32 20" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="30" r="3.5" fill="#DC2626" />
    <path d="M12 38C17 32 24 33 26 38C22 43 17 41 12 38Z" stroke="#1E1B4B" strokeWidth="2" fill="#FEF2F2" />
    <circle cx="20" cy="37" r="2.5" fill="#1E1B4B" />
    <path d="M52 38C47 32 40 33 38 38C42 43 47 41 52 38Z" stroke="#1E1B4B" strokeWidth="2" fill="#FEF2F2" />
    <circle cx="44" cy="37" r="2.5" fill="#1E1B4B" />
  </svg>
);

const ChhathPujaSun: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={`inline-block ${className}`}>
    <circle cx="32" cy="32" r="14" fill="#F59E0B" />
    <path d="M32 6V12M32 52V58M6 32H12M52 32H58M14 14L18 18M46 46L50 50M14 50L18 46M46 14L50 18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 48C18 46 22 50 28 48C34 46 38 50 44 48C48 46 51 49 52 48" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Bhagwan Surya Dev on 7-Horse Chariot (Uploaded Image 1 depiction for Chhath Puja)
const DivineSuryaChhathArtwork: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 800 600" fill="none" className={className}>
    <defs>
      <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" />
        <stop offset="0.5" stopColor="#FB923C" />
        <stop offset="1" stopColor="#FEF08A" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="400" y1="380" x2="400" y2="600" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EA580C" />
        <stop offset="1" stopColor="#7C2D12" />
      </linearGradient>
    </defs>
    <rect width="800" height="400" fill="url(#skyGrad)" />
    <circle cx="400" cy="380" r="140" fill="#FEF08A" fillOpacity="0.8" />
    <circle cx="400" cy="380" r="55" fill="#FFFBEB" />
    <rect y="380" width="800" height="220" fill="url(#waterGrad)" />
    <path d="M200 410C300 405 500 405 600 410M150 440C280 435 520 435 650 440" stroke="#FEF08A" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
    <circle cx="400" cy="140" r="75" fill="#FEF08A" fillOpacity="0.5" />
    <path d="M280 280C280 230 520 230 520 280L550 360C450 380 350 380 250 360L280 280Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
    {[-150, -100, -50, 0, 50, 100, 150].map((offset, i) => (
      <g key={i} transform={`translate(${400 + offset}, 335)`}>
        <path d="M-14 15C-14 0 -7 -15 0 -22C7 -15 14 0 14 15C11 25 -11 25 -14 15Z" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
        <circle cx="0" cy="-5" r="3" fill="#DC2626" />
      </g>
    ))}
    <path d="M360 210C360 170 440 170 440 210L455 270H345L360 210Z" fill="#16A34A" stroke="#EAB308" strokeWidth="2" />
    <path d="M375 220C375 190 425 190 425 220L435 270H365L375 220Z" fill="#DC2626" />
    <circle cx="400" cy="140" r="26" fill="#FED7AA" />
    <path d="M375 125L400 70L425 125Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
    <path d="M490 80V250M490 80L535 100L490 120" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

// Grand Golden Maa Durga Pratima (Uploaded Image 2 depiction for Durga Puja)
const GrandDurgaPratimaArtwork: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 800 600" fill="none" className={className}>
    <defs>
      <radialGradient id="pandalBackdrop" cx="400" cy="280" r="320" gradientUnits="userSpaceOnUse">
        <stop stopColor="#991B1B" />
        <stop offset="0.7" stopColor="#7F1D1D" />
        <stop offset="1" stopColor="#450A0A" />
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#pandalBackdrop)" />
    <path d="M160 500C160 220 250 80 400 80C550 80 640 220 640 500" stroke="#FACC15" strokeWidth="20" strokeLinecap="round" />
    <circle cx="400" cy="220" r="85" fill="#FEF08A" fillOpacity="0.3" />
    <path d="M350 160L400 65L450 160Z" fill="#FACC15" stroke="#78350F" strokeWidth="2" />
    <circle cx="400" cy="115" r="6" fill="#DC2626" />
    <ellipse cx="400" cy="205" rx="34" ry="40" fill="#FED7AA" />
    <ellipse cx="400" cy="180" rx="3.5" ry="6" fill="#DC2626" />
    <path d="M340 100L440 480" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
    <path d="M340 250C340 250 330 380 320 490C400 510 400 510 480 490C470 380 460 250 460 250Z" fill="#DC2626" stroke="#FACC15" strokeWidth="3" />
    <path d="M260 480C260 400 350 420 380 480C360 520 280 530 260 480Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
  </svg>
);

const PlatformBadge: React.FC<{ platform: Platform; className?: string }> = ({ platform, className = '' }) => {
  switch (platform) {
    case 'Flipkart':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-blue-50 text-blue-700 border-blue-200/80 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          Flipkart
        </span>
      );
    case 'Myntra':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-rose-50 text-rose-700 border-rose-200/80 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          Myntra
        </span>
      );
    case 'Meesho':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide shadow-xs bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/80 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-fuchsia-600 inline-block" />
          Meesho
        </span>
      );
  }
};

/* ==========================================================================
   4. COUNTDOWN TIMER COMPONENT
   ========================================================================== */

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const calculate = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (isNaN(diff) || diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isEnded: false,
    };
  };

  const [t, setT] = useState(calculate());

  useEffect(() => {
    setT(calculate());
    const id = setInterval(() => setT(calculate()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (t.isEnded) {
    return (
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shadow-2xs">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Sale Ended</span>
        <span className="text-xs text-rose-600/80">Stay tuned for upcoming festival offers!</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-2 sm:px-4 sm:py-2.5 rounded-2xl bg-amber-950/90 text-amber-50 backdrop-blur-md border border-amber-500/30 shadow-lg">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Festival Sale Ends In</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono tabular-nums text-sm font-bold">
        {[
          { label: 'Days', val: t.days },
          { label: 'Hours', val: t.hours },
          { label: 'Mins', val: t.minutes },
          { label: 'Secs', val: t.seconds },
        ].map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center bg-black/40 px-2.5 py-1 rounded-lg border border-amber-500/20 min-w-[42px]">
              <span className="text-base text-amber-200">{String(item.val).padStart(2, '0')}</span>
              <span className="text-[9px] uppercase font-sans text-amber-400/80 font-medium">{item.label}</span>
            </div>
            {idx < 3 && <span className="text-amber-400 font-bold">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   5. PRODUCT CARD COMPONENT
   ========================================================================== */

const ProductCard: React.FC<{
  product: Product;
  onCardClick?: (p: Product) => void;
}> = ({ product, onCardClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [triedProxy, setTriedProxy] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    setImgSrc(product.image);
    setImageError(false);
    setImageLoaded(false);
    setTriedProxy(false);
  }, [product.image]);

  const handleImageError = () => {
    if (!triedProxy && imgSrc && imgSrc.startsWith('http') && !imgSrc.includes('/api/image-proxy')) {
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRedirecting(true);
    api.recordClick(product.id).catch(() => {});
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
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <PlatformBadge platform={product.platform} />
        <div className="flex items-center gap-1">
          {product.is_demo && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/80 text-amber-200 backdrop-blur-xs">
              DEMO
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

        {product.discount > 0 && (
          <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded-md shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-800/80 font-medium mb-1 truncate">
            <span>{festivalLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.platform}</span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">{product.description}</p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
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
            <span className="text-[11px] font-medium text-slate-500">on {product.platform}</span>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={isRedirecting}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 shadow-xs cursor-pointer ${
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

/* ==========================================================================
   6. ADMIN PANEL COMPONENTS (LOGIN, DASHBOARD, ADD PRODUCT, SETTINGS)
   ========================================================================== */

const FESTIVAL_IMAGE_PRESETS = [
  { name: '🪔 Brass Diyas', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  { name: '🌺 Lal Paar Saree', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
  { name: '🌅 Bamboo Soop & Daura', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80' },
  { name: '🪔 Zari Anarkali Kurta', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
  { name: '🌅 Brass Surya Kalash', url: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80' },
  { name: '🌺 Brass Dhunachi', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80' },
  { name: '🪔 LED Fairy Lights', url: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80' },
  { name: '🌅 Yellow Vrat Saree', url: 'https://images.unsplash.com/photo-1610030469668-932d0f5c1d1a?auto=format&fit=crop&w=600&q=80' },
];

const AdminModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  settings: SaleSettings;
  onSettingsUpdate: (s: SaleSettings) => void;
  onProductsChanged: () => void;
}> = ({ isOpen, onClose, settings, onSettingsUpdate, onProductsChanged }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add_product' | 'settings'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [festival, setFestival] = useState<Festival>('diwali');
  const [platform, setPlatform] = useState<Platform>('Flipkart');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [limitedTime, setLimitedTime] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMsg, setExtractMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SaleSettings>({ ...settings });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Login State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('UtsavAdmin@2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.verifyAuth().then((authed) => {
        setIsAuthenticated(authed);
        if (authed) loadData();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setImage(editingProduct.image);
      setOriginalPrice(String(editingProduct.original_price));
      setSalePrice(String(editingProduct.sale_price));
      setFestival(editingProduct.festival);
      setPlatform(editingProduct.platform);
      setAffiliateUrl(editingProduct.affiliate_url);
      setDescription(editingProduct.description || '');
      setActive(editingProduct.active);
      setFeatured(editingProduct.featured);
      setLimitedTime(editingProduct.limited_time);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setName('');
    setImage('');
    setOriginalPrice('');
    setSalePrice('');
    setFestival('diwali');
    setPlatform('Flipkart');
    setAffiliateUrl('');
    setDescription('');
    setActive(true);
    setFeatured(false);
    setLimitedTime(false);
    setExtractMsg(null);
    setFormError(null);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, p] = await Promise.all([api.getAdminDashboard(), api.getAdminProducts()]);
      setStats(s);
      setAdminProducts(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      loadData();
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleAutoExtract = async () => {
    const targetUrl = affiliateUrl.trim() || image.trim();
    if (!targetUrl) {
      setFormError('Please enter a link first');
      return;
    }
    setIsExtracting(true);
    setExtractMsg(null);
    try {
      const data = await api.extractProductInfo(targetUrl);
      if (data.name && !name) setName(data.name);
      if (data.image) setImage(data.image);
      if (data.platform) setPlatform(data.platform);
      if (data.description && !description) setDescription(data.description);
      if (!affiliateUrl) setAffiliateUrl(targetUrl);
      setExtractMsg(data.image ? 'Product image and details extracted!' : 'Link parsed. You can also pick a preset image below.');
    } catch {
      setFormError('Could not fetch link details. Enter manually or pick a preset image.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      if (b64) {
        setImage(b64);
        setExtractMsg('Image uploaded directly from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const orig = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    if (isNaN(orig) || orig <= 0 || isNaN(sale) || sale < 0) {
      setFormError('Please enter valid prices');
      return;
    }
    if (sale > orig) {
      setFormError('Sale price cannot exceed original price');
      return;
    }
    const discount = Math.round(((orig - sale) / orig) * 100);

    const payload: Partial<Product> = {
      name: name.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      original_price: orig,
      sale_price: sale,
      discount,
      festival,
      platform,
      affiliate_url: affiliateUrl.trim(),
      description: description.trim(),
      active,
      featured,
      limited_time: limitedTime,
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      loadData();
      onProductsChanged();
      setEditingProduct(null);
      setActiveTab('products');
    } catch (err: any) {
      setFormError(err.message || 'Failed saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await api.deleteProduct(id);
    loadData();
    onProductsChanged();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(settingsForm);
      onSettingsUpdate(updated);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch {}
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-200 relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300 mx-auto flex items-center justify-center mb-3">
              <DiyaIcon size={30} />
            </div>
            <h2 className="text-2xl font-bold font-festive text-slate-900">Admin Authentication</h2>
            <p className="text-xs text-slate-500 mt-1">Sign in to manage festival products, sale settings, and track affiliate clicks.</p>
          </div>
          {loginError && <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
              Credentials: <strong>admin</strong> / <strong>UtsavAdmin@2026</strong>
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-100 rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <DiyaIcon size={18} />
            </div>
            <div>
              <span className="text-sm font-bold font-festive text-amber-200 block">{settings.website_name} — Admin Console</span>
              <span className="text-[10px] text-slate-400 block">Manage products, affiliate tracking & sale settings</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-xs text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800">Store</button>
            <button
              onClick={async () => {
                await api.logout();
                setIsAuthenticated(false);
              }}
              className="text-xs text-rose-300 hover:text-white px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900"
            >
              Logout
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-5 pt-2 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'products', label: `Products (${adminProducts.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'add_product', label: editingProduct ? 'Edit Product' : 'Add Product', icon: <PlusCircle className="w-4 h-4" /> },
            { id: 'settings', label: 'Sale Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id !== 'add_product') setEditingProduct(null);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id ? 'border-amber-600 text-amber-800' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs uppercase text-slate-500 font-semibold block">Total Products</span>
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{stats.totalProducts}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs uppercase text-slate-500 font-semibold block">Active Deals</span>
                  <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">{stats.activeProducts}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs uppercase text-slate-500 font-semibold block">Hidden</span>
                  <span className="text-2xl font-extrabold text-amber-700 tabular-nums">{stats.hiddenProducts}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <span className="text-xs uppercase text-slate-500 font-semibold block">Buy Now Clicks</span>
                  <span className="text-2xl font-extrabold text-rose-700 tabular-nums">{stats.totalClicks}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Festival Breakdown</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-amber-50"><span>🪔 Diwali Deals</span><strong>{stats.festivalBreakdown.diwali || 0}</strong></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-rose-50"><span>🌺 Durga Puja Picks</span><strong>{stats.festivalBreakdown.durga_puja || 0}</strong></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-orange-50"><span>🌅 Chhath Puja Collection</span><strong>{stats.festivalBreakdown.chhath_puja || 0}</strong></div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3">Platform Clicks</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-lg bg-blue-50"><span>Flipkart</span><strong>{stats.platformClicks.Flipkart || 0} Clicks</strong></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-rose-50"><span>Myntra</span><strong>{stats.platformClicks.Myntra || 0} Clicks</strong></div>
                    <div className="flex justify-between p-2.5 rounded-lg bg-fuchsia-50"><span>Meesho</span><strong>{stats.platformClicks.Meesho || 0} Clicks</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Catalog Items: {adminProducts.length}</span>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await api.deleteDemoProducts();
                      loadData();
                      onProductsChanged();
                    }}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg"
                  >
                    Delete Demo Items
                  </button>
                  <button
                    onClick={async () => {
                      await api.resetDemoProducts();
                      loadData();
                      onProductsChanged();
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Reset Demos
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveTab('add_product');
                    }}
                    className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg"
                  >
                    + Add Product
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b">
                    <tr>
                      <th className="p-3">Thumbnail</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Festival</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adminProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border bg-slate-100" />
                        </td>
                        <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{p.name}</td>
                        <td className="p-3 capitalize">{p.festival.replace('_', ' ')}</td>
                        <td className="p-3"><PlatformBadge platform={p.platform} /></td>
                        <td className="p-3 font-mono">₹{p.sale_price} <span className="line-through text-slate-400">₹{p.original_price}</span></td>
                        <td className="p-3 font-mono font-bold text-center">{p.clicks_count || 0}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setActiveTab('add_product');
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded mr-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'add_product' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300">
                <div className="flex items-center gap-2 mb-2 font-bold text-xs text-amber-900">
                  <Wand2 className="w-4 h-4 text-amber-700" />
                  <span>Auto-Extract from Product Link (Flipkart / Myntra / Meesho)</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={affiliateUrl}
                    onChange={(e) => setAffiliateUrl(e.target.value)}
                    placeholder="Paste Flipkart, Myntra, or Meesho product link..."
                    className="flex-1 px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAutoExtract}
                    disabled={isExtracting || !affiliateUrl.trim()}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {isExtracting ? 'Extracting...' : 'Extract Image & Info'}
                  </button>
                </div>
                {extractMsg && <div className="mt-2 text-xs font-medium text-emerald-700">✓ {extractMsg}</div>}
              </div>

              {formError && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{formError}</div>}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Pure Brass Kuber Diya Set"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Original Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="1499"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Sale Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          placeholder="699"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Festival *</label>
                        <select
                          value={festival}
                          onChange={(e) => setFestival(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="diwali">🪔 Diwali</option>
                          <option value="durga_puja">🌺 Durga Puja</option>
                          <option value="chhath_puja">🌅 Chhath Puja</option>
                          <option value="all">✨ All Festivals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Platform *</label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="Flipkart">Flipkart</option>
                          <option value="Myntra">Myntra</option>
                          <option value="Meesho">Meesho</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Affiliate URL *</label>
                      <input
                        type="url"
                        required
                        value={affiliateUrl}
                        onChange={(e) => setAffiliateUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Image URL / Direct Upload</label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Paste image link or upload below..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono mb-2"
                      />
                      <input type="file" ref={fileRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Phone / PC</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">Or pick a festival preset image:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                        {FESTIVAL_IMAGE_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImage(p.url)}
                            className="p-1 text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border rounded truncate"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">Image Preview:</span>
                      <div className="aspect-16/9 rounded-xl border border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {image ? (
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveTab('products');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-4">
              <h2 className="text-lg font-bold font-festive text-slate-900">Sale Settings & Banner</h2>
              {settingsSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl">✓ Settings saved successfully!</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Website Name</label>
                  <input
                    type="text"
                    value={settingsForm.website_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, website_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sale Title</label>
                  <input
                    type="text"
                    value={settingsForm.sale_title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, sale_title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promotional Banner Notice</label>
                <input
                  type="text"
                  value={settingsForm.banner_notice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, banner_notice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>
              <button type="submit" className="px-6 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl cursor-pointer">Save Settings</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   7. MAIN APPLICATION COMPONENT (DEFAULT EXPORT)
   ========================================================================== */

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SaleSettings>(DEFAULT_SETTINGS);
  const [selectedFestival, setSelectedFestival] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = async () => {
    try {
      const [s, p] = await Promise.all([api.getSettings(), api.getProducts()]);
      setSettings(s);
      setProducts(p);
    } catch {}
  };

  useEffect(() => {
    loadData();
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
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
    if (selectedFestival !== 'all') {
      list = list.filter((p) => p.festival === selectedFestival || p.festival === 'all');
    }
    if (selectedPlatform !== 'all') {
      list = list.filter((p) => p.platform.toLowerCase() === selectedPlatform.toLowerCase());
    }
    if (priceRange === 'under_500') list = list.filter((p) => p.sale_price < 500);
    else if (priceRange === '500_1000') list = list.filter((p) => p.sale_price >= 500 && p.sale_price <= 1000);
    else if (priceRange === '1000_2000') list = list.filter((p) => p.sale_price > 1000 && p.sale_price <= 2000);
    else if (priceRange === 'above_2000') list = list.filter((p) => p.sale_price > 2000);

    if (sortBy === 'price_asc') list.sort((a, b) => a.sale_price - b.sale_price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.sale_price - a.sale_price);
    else if (sortBy === 'discount_desc') list.sort((a, b) => b.discount - a.discount);
    else if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else {
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }
    return list;
  }, [products, searchQuery, selectedFestival, selectedPlatform, priceRange, sortBy]);

  const trendingProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const limitedDeals = useMemo(() => products.filter((p) => p.limited_time), [products]);

  const handleSelectFestival = (fest: string) => {
    setSelectedFestival(fest);
    const el = document.getElementById('deals-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbfa] text-slate-800 selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => handleSelectFestival('all')} className="flex items-center gap-2.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-sm">
              <DiyaIcon size={24} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 font-festive block leading-tight">
                {settings.website_name}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700 block">
                Festival Shopping 2026
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <button onClick={() => handleSelectFestival('all')} className={`hover:text-amber-800 ${selectedFestival === 'all' ? 'text-amber-700 font-bold underline decoration-2 underline-offset-8' : ''}`}>All Deals</button>
            <button onClick={() => handleSelectFestival('durga_puja')} className={`hover:text-rose-700 ${selectedFestival === 'durga_puja' ? 'text-rose-700 font-bold underline decoration-2 underline-offset-8' : ''}`}>🌺 Durga Puja</button>
            <button onClick={() => handleSelectFestival('diwali')} className={`hover:text-amber-700 ${selectedFestival === 'diwali' ? 'text-amber-700 font-bold underline decoration-2 underline-offset-8' : ''}`}>🪔 Diwali</button>
            <button onClick={() => handleSelectFestival('chhath_puja')} className={`hover:text-orange-700 ${selectedFestival === 'chhath_puja' ? 'text-orange-700 font-bold underline decoration-2 underline-offset-8' : ''}`}>🌅 Chhath Puja</button>
            <a href="#how-it-works" className="hover:text-amber-800">How It Works</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-amber-50 text-xs font-medium flex items-center gap-1">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button onClick={() => setIsAdminOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 shadow-2xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-slate-600">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-100 bg-white px-4 py-3 space-y-2">
            <button onClick={() => { handleSelectFestival('all'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg bg-amber-50">All Deals</button>
            <button onClick={() => { handleSelectFestival('durga_puja'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-rose-700">🌺 Durga Puja</button>
            <button onClick={() => { handleSelectFestival('diwali'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-amber-700">🪔 Diwali</button>
            <button onClick={() => { handleSelectFestival('chhath_puja'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-orange-700">🌅 Chhath Puja</button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION WITH DIVINE SURYA & DURGA ARTWORK */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-rose-500 rounded-full blur-3xl" />
        </div>

        {/* Ambient Divine Festive Artwork (Maa Durga & Bhagwan Surya Dev) */}
        <div className="absolute -left-16 top-10 w-72 md:w-96 h-96 opacity-20 hover:opacity-40 transition-opacity duration-700 pointer-events-none hidden sm:block">
          <GrandDurgaPratimaArtwork className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]" />
        </div>
        <div className="absolute -right-16 top-10 w-72 md:w-96 h-96 opacity-20 hover:opacity-40 transition-opacity duration-700 pointer-events-none hidden sm:block">
          <DivineSuryaChhathArtwork className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {settings.banner_active && settings.banner_notice && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold mb-6 max-w-3xl backdrop-blur-md">
              <span>🔥</span>
              <span className="truncate">{settings.banner_notice}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-widest text-amber-300 font-semibold mb-3">
            <span>🌺 Durga Puja</span>
            <span>•</span>
            <span>🪔 Diwali</span>
            <span>•</span>
            <span>🌅 Chhath Puja</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-festive tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 max-w-4xl">
            {settings.sale_title}
          </h1>

          <p className="mt-3 text-base sm:text-xl lg:text-2xl font-medium text-amber-100/90 max-w-2xl">
            {settings.sale_subtitle}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-amber-200/70 max-w-xl">
            {settings.sale_description}
          </p>

          <div className="mt-8">
            <CountdownTimer targetDate={settings.sale_end_date} />
          </div>

          <div className="mt-8">
            <button
              onClick={() => handleSelectFestival('all')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>SHOP NOW</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-amber-500/20 flex flex-wrap items-center justify-center gap-6 text-xs text-amber-200/80">
            <span className="font-semibold uppercase tracking-wider text-amber-400">Verified Platforms:</span>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><span className="w-2 h-2 rounded-full bg-blue-400" />Flipkart</div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><span className="w-2 h-2 rounded-full bg-rose-400" />Myntra</div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"><span className="w-2 h-2 rounded-full bg-fuchsia-400" />Meesho</div>
          </div>
        </div>
      </section>

      {/* 3. FESTIVAL CATEGORIES WITH GRAND ARTWORK */}
      <section className="py-12 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-festive">
              Shop by Festival Celebrations
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Curated festive picks and mega discounts across Flipkart, Myntra, and Meesho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Durga Puja */}
            <div
              onClick={() => handleSelectFestival('durga_puja')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-gradient-to-b from-rose-600/10 via-red-50 to-white ${
                selectedFestival === 'durga_puja' ? 'border-rose-500 ring-4 ring-rose-300' : 'border-rose-200 hover:shadow-lg'
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-black/5">
                <GrandDurgaPratimaArtwork className="w-full h-32 object-cover rounded-xl" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Traditional & Trending Festival Picks
              </span>
              <h3 className="text-xl font-bold font-festive text-slate-900 mt-2">DURGA PUJA</h3>
              <p className="text-xs text-slate-600 mt-1">Lal paar sarees, brass dhunachi, terracotta jewellery & festive ethnic wear</p>
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-rose-700">
                <span>View Durga Puja Deals</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Diwali */}
            <div
              onClick={() => handleSelectFestival('diwali')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-gradient-to-b from-amber-600/10 via-yellow-50 to-white ${
                selectedFestival === 'diwali' ? 'border-amber-500 ring-4 ring-amber-300' : 'border-amber-200 hover:shadow-lg'
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 h-32 flex items-center justify-center gap-4 text-white">
                <DiyaIcon size={38} className="text-yellow-300" />
                <DiyaIcon size={48} className="text-amber-100" />
                <DiyaIcon size={38} className="text-yellow-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                Diwali Shopping Deals
              </span>
              <h3 className="text-xl font-bold font-festive text-slate-900 mt-2">DIWALI</h3>
              <p className="text-xs text-slate-600 mt-1">Artisanal brass diyas, fairy LED lights, pooja thalis & luxury gift hampers</p>
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>View Diwali Dhamaka Deals</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Chhath Puja */}
            <div
              onClick={() => handleSelectFestival('chhath_puja')}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer bg-gradient-to-b from-orange-600/10 via-amber-50 to-white ${
                selectedFestival === 'chhath_puja' ? 'border-orange-500 ring-4 ring-orange-300' : 'border-orange-200 hover:shadow-lg'
              }`}
            >
              <div className="mb-4 overflow-hidden rounded-xl border border-black/5">
                <DivineSuryaChhathArtwork className="w-full h-32 object-cover rounded-xl" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-900">
                Special Chhath Puja Collection
              </span>
              <h3 className="text-xl font-bold font-festive text-slate-900 mt-2">CHHATH PUJA</h3>
              <p className="text-xs text-slate-600 mt-1">Handwoven bamboo soop & daura, pure brass kalash, thekua moulds & yellow sarees</p>
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-bold text-orange-800">
                <span>View Chhath Holy Collection</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRENDING DEALS (FEATURED) */}
      {trendingProducts.length > 0 && (
        <section className="py-10 bg-amber-50/40 border-y border-amber-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-festive text-slate-900 flex items-center gap-2">
                <span>🔥 TRENDING FESTIVAL DEALS</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Top handpicked festive picks with highest discounts</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {trendingProducts.map((p) => (
                <ProductCard key={p.id} product={p} onCardClick={(item) => setSelectedProduct(item)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. LIMITED TIME DEALS */}
      {limitedDeals.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-festive text-slate-900 flex items-center gap-2">
                <span>⚡ LIMITED TIME FESTIVAL DEALS</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Flash discounts available for a limited period</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {limitedDeals.map((p) => (
                <ProductCard key={p.id} product={p} onCardClick={(item) => setSelectedProduct(item)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. COMPLETE PRODUCT CATALOG WITH SEARCH & FILTERS */}
      <section id="deals-section" className="py-12 bg-slate-50/50 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900">Browse All Festival Offers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Genuine affiliate deals from Flipkart, Myntra, and Meesho</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search kurti, diya, saree, thali..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs mb-6 flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {['all', 'durga_puja', 'diwali', 'chhath_puja'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFestival(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
                    selectedFestival === f ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Festivals' : f === 'durga_puja' ? '🌺 Durga Puja' : f === 'diwali' ? '🪔 Diwali' : '🌅 Chhath Puja'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-100 border text-xs font-semibold py-1.5 px-2.5 rounded-lg"
              >
                <option value="all">All Platforms</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Myntra">Myntra</option>
                <option value="Meesho">Meesho</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-slate-100 border text-xs font-semibold py-1.5 px-2.5 rounded-lg"
              >
                <option value="all">All Prices</option>
                <option value="under_500">Under ₹500</option>
                <option value="500_1000">₹500 – ₹1,000</option>
                <option value="1000_2000">₹1,000 – ₹2,000</option>
                <option value="above_2000">Above ₹2,000</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 border text-xs font-semibold py-1.5 px-2.5 rounded-lg"
              >
                <option value="featured">Featured</option>
                <option value="discount_desc">Highest Discount</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* 2-Column Mobile / 4-Column Desktop Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onCardClick={(item) => setSelectedProduct(item)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed text-slate-500">
              <p className="font-semibold text-sm">No products found matching filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFestival('all');
                  setSelectedPlatform('all');
                  setPriceRange('all');
                }}
                className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. HOW IT WORKS & TRUST SECTION */}
      <section id="how-it-works" className="py-16 bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-festive text-slate-900">How Utsav Mega Sale Works</h2>
            <p className="mt-2 text-sm text-slate-600">We discover and verify the highest festival discounts across India's top retailers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 text-center sm:text-left">
            {[
              { step: '01', title: 'Browse Products', desc: 'Find deals across Diwali, Durga Puja & Chhath Puja.' },
              { step: '02', title: 'Compare Deals', desc: 'Check original vs sale price and verified discount %.' },
              { step: '03', title: 'Click Buy Now', desc: 'Click Buy Now on any item you love.' },
              { step: '04', title: 'Secure Redirect', desc: 'You are redirected directly to Flipkart, Myntra or Meesho.' },
              { step: '05', title: 'Complete Purchase', desc: 'Purchase safely with official seller warranties and delivery.' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <span className="font-mono text-xs font-bold text-amber-800">{s.step}</span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 leading-relaxed">
            <strong>Affiliate Transparency Notice:</strong> We are an affiliate shopping website. When you click "BUY NOW", you are redirected to the original shopping platform (Flipkart, Myntra, or Meesho) through our affiliate link. We never process payments or collect customer addresses on our website.
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-base font-bold font-festive text-white block">{settings.website_name}</span>
            <p className="mt-1 text-slate-500">© 2026 {settings.website_name}. All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-white">Admin Login</button>
            <a href="#how-it-works" className="hover:text-white">Affiliate Disclosure</a>
            <a href="#deals-section" className="hover:text-white">All Deals</a>
          </div>
        </div>
      </footer>

      {/* 9. MODALS */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onSettingsUpdate={(s) => setSettings(s)}
        onProductsChanged={loadData}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-16/10 rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <PlatformBadge platform={selectedProduct.platform} />
            <h2 className="text-lg font-bold font-festive text-slate-900 mt-2">{selectedProduct.name}</h2>
            <div className="mt-2 text-xl font-bold font-mono">
              ₹{selectedProduct.sale_price} <span className="line-through text-sm text-slate-400">₹{selectedProduct.original_price}</span>
              <span className="ml-2 text-xs text-emerald-600 font-bold">{selectedProduct.discount}% OFF</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">{selectedProduct.description}</p>
            <button
              onClick={() => {
                api.recordClick(selectedProduct.id);
                window.open(selectedProduct.affiliate_url, '_blank', 'noopener,noreferrer');
              }}
              className="mt-5 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>BUY NOW ON {selectedProduct.platform.toUpperCase()}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl relative">
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-4 right-4 p-1"><X className="w-4 h-4" /></button>
            <h3 className="text-xs font-bold uppercase text-amber-700 mb-3">Search Products</h3>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, festival, category..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSearchOpen(false);
                  const el = document.getElementById('deals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
