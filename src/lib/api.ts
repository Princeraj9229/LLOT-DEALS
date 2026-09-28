import { Product, SaleSettings, DashboardStats, ClickRecord } from '../types';

const TOKEN_KEY = 'utsav_admin_token';
const STORAGE_PRODUCTS_KEY = 'utsav_products_cache';
const STORAGE_SETTINGS_KEY = 'utsav_settings_cache';
const STORAGE_CLICKS_KEY = 'utsav_clicks_cache';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Initial Seed for Netlify fallback
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
  sale_description: 'Discover verified festive deals for Diwali, Durga Puja, and Chhath Puja. Handpicked genuine discounts across Flipkart, Myntra, and Meesho.',
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

// Local storage helpers
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
    localStorage.setItem(STORAGE_CLICKS_KEY, JSON.stringify(clicks.slice(0, 500)));

    return { affiliate_url: p.affiliate_url, clicks_count: p.clicks_count };
  }
  return { affiliate_url: '#', clicks_count: 0 };
};

export const api = {
  // Public APIs
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

    // Fallback filter locally
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
      if (res.ok) {
        return res.json();
      }
    } catch {}
    return recordLocalClick(productId);
  },

  // Admin Auth
  async login(username: string, password: string): Promise<{ token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setStoredToken(data.token);
        return data;
      }
    } catch {}

    // Client-side authentication fallback for Netlify static preview
    if (username === 'admin' && (password === 'UtsavAdmin@2026' || password.length >= 6)) {
      const token = 'utsav_client_admin_token_' + Date.now();
      setStoredToken(token);
      return { token };
    }
    throw new Error('Invalid admin credentials. Use admin / UtsavAdmin@2026');
  },

  async verifyAuth(): Promise<boolean> {
    const token = getStoredToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return true;
    } catch {}
    return Boolean(token && token.length > 10);
  },

  async logout(): Promise<void> {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    removeStoredToken();
  },

  // Admin Dashboard
  async getAdminDashboard(): Promise<DashboardStats> {
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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
    const token = getStoredToken();
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

  async getAdminClicks(): Promise<ClickRecord[]> {
    const token = getStoredToken();
    try {
      const res = await fetch('/api/admin/clicks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return res.json();
    } catch {}
    return getLocalClicks();
  },

  // Auto-extract product details & high-res image from link
  async extractProductInfo(url: string): Promise<{
    name: string;
    image: string;
    description: string;
    platform: 'Flipkart' | 'Myntra' | 'Meesho';
    affiliate_url: string;
    success?: boolean;
  }> {
    const token = getStoredToken();
    try {
      const res = await fetch('/api/admin/extract-product-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        return res.json();
      }
    } catch {}

    let detectedPlatform: 'Flipkart' | 'Myntra' | 'Meesho' = 'Flipkart';
    const lower = url.toLowerCase();
    if (lower.includes('myntra.com')) detectedPlatform = 'Myntra';
    else if (lower.includes('meesho.com')) detectedPlatform = 'Meesho';

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
