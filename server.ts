import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

app.use(express.json());

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'UtsavAdmin@2026';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'utsav_mega_sale_secure_token_key_2026';

// In-memory active tokens
const activeTokens = new Set<string>();

export interface Product {
  id: string;
  name: string;
  image: string;
  original_price: number;
  sale_price: number;
  discount: number;
  festival: 'diwali' | 'durga_puja' | 'chhath_puja' | 'all';
  platform: 'Flipkart' | 'Myntra' | 'Meesho';
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
  platform: string;
  festival: string;
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

interface DatabaseSchema {
  products: Product[];
  clicks: ClickRecord[];
  settings: SaleSettings;
}

// Initial demo products
const getInitialDemoProducts = (): Product[] => [
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
    id: 'prod-diwali-3',
    name: '25-Meter Warm Amber LED Fairy Rice String Lights',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80',
    original_price: 699,
    sale_price: 269,
    discount: 62,
    festival: 'diwali',
    platform: 'Meesho',
    affiliate_url: 'https://www.meesho.com/?affid=utsavmegasale&subid=diwali_fairy_lights',
    description: 'Waterproof 100-bulb decorative string lights with 8 flashing modes for balcony, mandir, and outdoor festive lighting.',
    active: true,
    featured: false,
    limited_time: false,
    is_demo: true,
    clicks_count: 29,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'prod-diwali-4',
    name: 'Pure Brass Lakshmi Ganesh Pooja Thali Gift Hamper',
    image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
    original_price: 2499,
    sale_price: 1099,
    discount: 56,
    festival: 'diwali',
    platform: 'Flipkart',
    affiliate_url: 'https://www.flipkart.com/?affid=utsavmegasale&subid=diwali_pooja_thali',
    description: 'Complete 7-piece carved pooja set with bell, agarbatti holder, diya, roli chawal katori, and embossed brass plate.',
    active: true,
    featured: false,
    limited_time: true,
    is_demo: true,
    clicks_count: 38,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
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
    id: 'prod-durga-3',
    name: 'Artisan Terracotta Necklace & Jhumka Jewellery Set',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    original_price: 899,
    sale_price: 389,
    discount: 57,
    festival: 'durga_puja',
    platform: 'Meesho',
    affiliate_url: 'https://www.meesho.com/?affid=utsavmegasale&subid=durgapuja_terracotta_jewellery',
    description: 'Eco-friendly organic clay hand-painted jewellery set with intricate Maa Durga motifs and matching jhumkas.',
    active: true,
    featured: false,
    limited_time: false,
    is_demo: true,
    clicks_count: 22,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prod-durga-4',
    name: "Men's Handwoven Tussar Silk Dhoti & Kurta Set",
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    original_price: 3499,
    sale_price: 1499,
    discount: 57,
    festival: 'durga_puja',
    platform: 'Myntra',
    affiliate_url: 'https://www.myntra.com/?affid=utsavmegasale&subid=durgapuja_men_dhoti_kurta',
    description: 'Classic mustard and ivory festive kurta with readymade stitched pleated dhoti for Pujo pandal hopping.',
    active: true,
    featured: false,
    limited_time: true,
    is_demo: true,
    clicks_count: 35,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
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
  {
    id: 'prod-chhath-3',
    name: 'Chhathi Maiya Vrat Special Haldi-Yellow Cotton Saree',
    image: 'https://images.unsplash.com/photo-1610030469668-932d0f5c1d1a?auto=format&fit=crop&w=600&q=80',
    original_price: 2199,
    sale_price: 899,
    discount: 59,
    festival: 'chhath_puja',
    platform: 'Myntra',
    affiliate_url: 'https://www.myntra.com/?affid=utsavmegasale&subid=chhath_yellow_saree',
    description: 'Pure breathable unstitched cotton yellow saree with traditional vermilion red border for fasting Vratis.',
    active: true,
    featured: false,
    limited_time: false,
    is_demo: true,
    clicks_count: 39,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prod-chhath-4',
    name: 'Authentic Handcrafted Sheesham Wood Thekua Mould (Sancha)',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    original_price: 499,
    sale_price: 199,
    discount: 60,
    festival: 'chhath_puja',
    platform: 'Meesho',
    affiliate_url: 'https://www.meesho.com/?affid=utsavmegasale&subid=chhath_thekua_sancha',
    description: 'Double-sided carved wooden sancha for shaping traditional wheat flour & jaggery Prasad thekua with sacred sun motif.',
    active: true,
    featured: false,
    limited_time: true,
    is_demo: true,
    clicks_count: 27,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const getDefaultSettings = (): SaleSettings => {
  // Sale ends in 35 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 35);
  targetDate.setHours(23, 59, 59, 999);

  return {
    website_name: 'Utsav Mega Sale',
    sale_title: 'FESTIVAL MEGA SALE 2026',
    sale_subtitle: 'Celebrate More. Shop More. Save More.',
    sale_description: 'Discover verified festive deals for Diwali, Durga Puja, and Chhath Puja. We partner with top shopping platforms to bring genuine discounts directly to you.',
    sale_end_date: targetDate.toISOString(),
    banner_notice: '🔥 FESTIVAL SPECIAL OFFERS: Exclusive festival discounts now live across Flipkart, Myntra & Meesho!',
    banner_active: true,
    contact_email: 'support@utsavmegasale.in',
    contact_phone: '+91 98765 43210',
    social_instagram: 'https://instagram.com/utsavmegasale',
    social_telegram: 'https://t.me/utsavmegasale',
    social_whatsapp: 'https://wa.me/919876543210',
    updated_at: new Date().toISOString(),
  };
};

// Database persistence helpers
const ensureDb = (): DatabaseSchema => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      products: getInitialDemoProducts(),
      clicks: [
        {
          id: 'click-demo-1',
          product_id: 'prod-diwali-1',
          product_name: 'Artisanal Brass Kuber Diya Set (Pack of 12)',
          platform: 'Flipkart',
          festival: 'diwali',
          clicked_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'click-demo-2',
          product_id: 'prod-diwali-2',
          product_name: 'Zari Embroidered Anarkali Kurta & Silk Dupatta Set',
          platform: 'Myntra',
          festival: 'diwali',
          clicked_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'click-demo-3',
          product_id: 'prod-durga-1',
          product_name: 'Authentic Bengal Handloom Lal Paar Cotton Saree',
          platform: 'Myntra',
          festival: 'durga_puja',
          clicked_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'click-demo-4',
          product_id: 'prod-chhath-1',
          product_name: 'Traditional Hand-Woven Bamboo Daura & Soop Set (2 Pcs)',
          platform: 'Meesho',
          festival: 'chhath_puja',
          clicked_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        },
      ],
      settings: getDefaultSettings(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.products || !Array.isArray(parsed.products)) {
      parsed.products = getInitialDemoProducts();
    }
    if (!parsed.clicks || !Array.isArray(parsed.clicks)) {
      parsed.clicks = [];
    }
    if (!parsed.settings) {
      parsed.settings = getDefaultSettings();
    }
    return parsed;
  } catch (err) {
    console.error('Failed reading DB file, recreating default:', err);
    const initialData: DatabaseSchema = {
      products: getInitialDemoProducts(),
      clicks: [],
      settings: getDefaultSettings(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
};

const writeDb = (data: DatabaseSchema) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeTokens.has(token)) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  next();
};

/* ================== PUBLIC API ROUTES ================== */

// 1. Settings (Public)
app.get('/api/settings', (req: Request, res: Response) => {
  const db = ensureDb();
  res.json(db.settings);
});

// 2. Products (Public)
app.get('/api/products', (req: Request, res: Response) => {
  const db = ensureDb();
  let list = db.products.filter((p) => p.active);

  const { q, festival, platform, price_range, sort, section } = req.query;

  // Search filter
  if (typeof q === 'string' && q.trim()) {
    const query = q.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.platform.toLowerCase().includes(query) ||
        p.festival.toLowerCase().includes(query)
    );
  }

  // Festival filter
  if (typeof festival === 'string' && festival !== 'all') {
    list = list.filter((p) => p.festival === festival || p.festival === 'all');
  }

  // Platform filter
  if (typeof platform === 'string' && platform !== 'all') {
    list = list.filter((p) => p.platform.toLowerCase() === platform.toLowerCase());
  }

  // Price range filter
  if (typeof price_range === 'string') {
    if (price_range === 'under_500') {
      list = list.filter((p) => p.sale_price < 500);
    } else if (price_range === '500_1000') {
      list = list.filter((p) => p.sale_price >= 500 && p.sale_price <= 1000);
    } else if (price_range === '1000_2000') {
      list = list.filter((p) => p.sale_price > 1000 && p.sale_price <= 2000);
    } else if (price_range === 'above_2000') {
      list = list.filter((p) => p.sale_price > 2000);
    }
  }

  // Special section filter
  if (section === 'featured') {
    list = list.filter((p) => p.featured);
  } else if (section === 'limited') {
    list = list.filter((p) => p.limited_time);
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.sale_price - b.sale_price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.sale_price - a.sale_price);
  } else if (sort === 'discount_desc') {
    list.sort((a, b) => b.discount - a.discount);
  } else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    // Default: featured first, then newest
    list.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  res.json(list);
});

// 3. Track Click (Public - when user clicks "Buy Now")
app.post('/api/clicks', (req: Request, res: Response) => {
  const { product_id } = req.body;
  if (!product_id) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  const db = ensureDb();
  const product = db.products.find((p) => p.id === product_id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Increment clicks count on product
  product.clicks_count = (product.clicks_count || 0) + 1;

  // Record click event
  const clickRecord: ClickRecord = {
    id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    product_id: product.id,
    product_name: product.name,
    platform: product.platform,
    festival: product.festival,
    clicked_at: new Date().toISOString(),
  };

  db.clicks.unshift(clickRecord);
  // Cap clicks history to latest 2000
  if (db.clicks.length > 2000) {
    db.clicks = db.clicks.slice(0, 2000);
  }

  writeDb(db);

  res.json({
    success: true,
    affiliate_url: product.affiliate_url,
    clicks_count: product.clicks_count,
  });
});

/* ================== ADMIN AUTH ROUTES ================== */

// Admin login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.add(token);
    return res.json({
      success: true,
      token,
      admin: {
        username: ADMIN_USERNAME,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid admin username or password' });
});

// Admin verify session
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  if (activeTokens.has(token)) {
    return res.json({ authenticated: true, username: ADMIN_USERNAME });
  }

  return res.status(401).json({ authenticated: false });
});

// Admin logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

/* ================== ADMIN DASHBOARD & CRUD ROUTES ================== */

// Admin stats
app.get('/api/admin/dashboard', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();

  const totalProducts = db.products.length;
  const activeProducts = db.products.filter((p) => p.active).length;
  const hiddenProducts = totalProducts - activeProducts;
  const totalClicks = db.clicks.length;

  const festivalBreakdown: Record<string, number> = {
    diwali: 0,
    durga_puja: 0,
    chhath_puja: 0,
    all: 0,
  };

  const platformBreakdown: Record<string, number> = {
    Flipkart: 0,
    Myntra: 0,
    Meesho: 0,
  };

  const platformClicks: Record<string, number> = {
    Flipkart: 0,
    Myntra: 0,
    Meesho: 0,
  };

  db.products.forEach((p) => {
    festivalBreakdown[p.festival] = (festivalBreakdown[p.festival] || 0) + 1;
    platformBreakdown[p.platform] = (platformBreakdown[p.platform] || 0) + 1;
  });

  db.clicks.forEach((c) => {
    platformClicks[c.platform] = (platformClicks[c.platform] || 0) + 1;
  });

  res.json({
    totalProducts,
    activeProducts,
    hiddenProducts,
    totalClicks,
    festivalBreakdown,
    platformBreakdown,
    platformClicks,
    recentClicks: db.clicks.slice(0, 50),
  });
});

// Admin all products (including hidden)
app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();
  res.json(db.products);
});

// Admin create product
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    image,
    original_price,
    sale_price,
    festival,
    platform,
    affiliate_url,
    description,
    active,
    featured,
    limited_time,
  } = req.body;

  if (!name || !original_price || !sale_price || !affiliate_url || !platform || !festival) {
    return res.status(400).json({ error: 'Please provide all required product fields' });
  }

  const origPrice = Number(original_price);
  const sPrice = Number(sale_price);

  if (isNaN(origPrice) || isNaN(sPrice) || sPrice < 0 || origPrice <= 0) {
    return res.status(400).json({ error: 'Invalid price values' });
  }

  const discount = Math.max(0, Math.round(((origPrice - sPrice) / origPrice) * 100));

  const db = ensureDb();
  const newProduct: Product = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: String(name).trim(),
    image: image ? String(image).trim() : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    original_price: origPrice,
    sale_price: sPrice,
    discount,
    festival,
    platform,
    affiliate_url: String(affiliate_url).trim(),
    description: description ? String(description).trim() : '',
    active: active !== undefined ? Boolean(active) : true,
    featured: Boolean(featured),
    limited_time: Boolean(limited_time),
    is_demo: false,
    clicks_count: 0,
    created_at: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  writeDb(db);

  res.status(201).json(newProduct);
});

// Admin update product
app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = ensureDb();
  const index = db.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const {
    name,
    image,
    original_price,
    sale_price,
    festival,
    platform,
    affiliate_url,
    description,
    active,
    featured,
    limited_time,
  } = req.body;

  const origPrice = original_price !== undefined ? Number(original_price) : existing.original_price;
  const sPrice = sale_price !== undefined ? Number(sale_price) : existing.sale_price;
  const discount = Math.max(0, Math.round(((origPrice - sPrice) / origPrice) * 100));

  const updated: Product = {
    ...existing,
    name: name !== undefined ? String(name).trim() : existing.name,
    image: image !== undefined ? String(image).trim() : existing.image,
    original_price: origPrice,
    sale_price: sPrice,
    discount,
    festival: festival !== undefined ? festival : existing.festival,
    platform: platform !== undefined ? platform : existing.platform,
    affiliate_url: affiliate_url !== undefined ? String(affiliate_url).trim() : existing.affiliate_url,
    description: description !== undefined ? String(description).trim() : existing.description,
    active: active !== undefined ? Boolean(active) : existing.active,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    limited_time: limited_time !== undefined ? Boolean(limited_time) : existing.limited_time,
  };

  db.products[index] = updated;
  writeDb(db);

  res.json(updated);
});

// Admin delete product
app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const db = ensureDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);

  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Admin delete all demo products
app.post('/api/admin/products/delete-demo', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();
  const countBefore = db.products.length;
  db.products = db.products.filter((p) => !p.is_demo);
  const deletedCount = countBefore - db.products.length;
  writeDb(db);
  res.json({ success: true, deletedCount, message: `Removed ${deletedCount} demo products` });
});

// Admin reset demo products
app.post('/api/admin/products/reset-demo', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();
  const demos = getInitialDemoProducts();
  // Filter out any existing demos first, then prepend fresh demos
  const nonDemos = db.products.filter((p) => !p.is_demo);
  db.products = [...demos, ...nonDemos];
  writeDb(db);
  res.json({ success: true, message: 'Demo products restored successfully', count: demos.length });
});

// Admin update settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();
  const {
    website_name,
    sale_title,
    sale_subtitle,
    sale_description,
    sale_end_date,
    banner_notice,
    banner_active,
    contact_email,
    contact_phone,
    social_instagram,
    social_telegram,
    social_whatsapp,
  } = req.body;

  db.settings = {
    ...db.settings,
    website_name: website_name !== undefined ? String(website_name).trim() : db.settings.website_name,
    sale_title: sale_title !== undefined ? String(sale_title).trim() : db.settings.sale_title,
    sale_subtitle: sale_subtitle !== undefined ? String(sale_subtitle).trim() : db.settings.sale_subtitle,
    sale_description: sale_description !== undefined ? String(sale_description).trim() : db.settings.sale_description,
    sale_end_date: sale_end_date !== undefined ? String(sale_end_date).trim() : db.settings.sale_end_date,
    banner_notice: banner_notice !== undefined ? String(banner_notice).trim() : db.settings.banner_notice,
    banner_active: banner_active !== undefined ? Boolean(banner_active) : db.settings.banner_active,
    contact_email: contact_email !== undefined ? String(contact_email).trim() : db.settings.contact_email,
    contact_phone: contact_phone !== undefined ? String(contact_phone).trim() : db.settings.contact_phone,
    social_instagram: social_instagram !== undefined ? String(social_instagram).trim() : db.settings.social_instagram,
    social_telegram: social_telegram !== undefined ? String(social_telegram).trim() : db.settings.social_telegram,
    social_whatsapp: social_whatsapp !== undefined ? String(social_whatsapp).trim() : db.settings.social_whatsapp,
    updated_at: new Date().toISOString(),
  };

  writeDb(db);
  res.json(db.settings);
});

// Admin click history
app.get('/api/admin/clicks', requireAdmin, (req: Request, res: Response) => {
  const db = ensureDb();
  res.json(db.clicks);
});

// Image Proxy to prevent CORS/hotlinking issues
app.get('/api/image-proxy', async (req: Request, res: Response) => {
  const imageUrl = req.query.url;
  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).send('Image URL required');
  }
  try {
    const parsed = new URL(imageUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).send('Invalid protocol');
    }
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: parsed.origin,
      },
    });
    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send('Image proxy error');
  }
});

// Auto-extract product title, image, and platform from pasted affiliate link
app.post('/api/admin/extract-product-info', requireAdmin, async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required' });
  }

  try {
    const trimmed = url.trim();
    const parsed = new URL(trimmed);
    let platform: 'Flipkart' | 'Myntra' | 'Meesho' = 'Flipkart';
    const host = parsed.hostname.toLowerCase();
    if (host.includes('myntra.com') || host.includes('myntr.it')) platform = 'Myntra';
    else if (host.includes('meesho.com') || host.includes('meesho.app')) platform = 'Meesho';
    else if (host.includes('flipkart.com') || host.includes('fkrt.it')) platform = 'Flipkart';

    // If already direct image link
    if (/\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(trimmed)) {
      return res.json({
        name: '',
        image: trimmed,
        platform,
        affiliate_url: trimmed,
      });
    }

    const response = await fetch(trimmed, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    const html = await response.text();

    const getMeta = (prop: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]+(?:property|name)=["'](?:og:|twitter:)?${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:|twitter:)?${prop}["']`, 'i'));
      return match ? match[1].replace(/&amp;/g, '&') : '';
    };

    let title = getMeta('title');
    if (!title) {
      const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleTag) title = titleTag[1].trim();
    }
    if (title) {
      title = title.replace(/\s*[:|–-]\s*(Buy|Online at|Flipkart|Myntra|Meesho).*$/i, '').trim();
    }

    let image = getMeta('image');
    if (!image) {
      const linkMatch = html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i);
      if (linkMatch) image = linkMatch[1];
    }

    // Try finding img tag with high resolution if meta image wasn't found
    if (!image) {
      const imgMatch = html.match(/<img[^>]+src=["'](https:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["']/i);
      if (imgMatch) image = imgMatch[1];
    }

    let description = getMeta('description');
    if (description && description.length > 250) {
      description = description.slice(0, 250) + '...';
    }

    return res.json({
      name: title || '',
      image: image || '',
      description: description || '',
      platform,
      affiliate_url: trimmed,
      success: true,
    });
  } catch (err: any) {
    return res.json({
      name: '',
      image: '',
      platform: 'Flipkart',
      affiliate_url: url.trim(),
      message: 'Could not auto-fetch link details, but you can enter them manually.',
      success: false,
    });
  }
});


/* ================== FRONTEND MOUNTING ================== */

async function startServer() {
  // Ensure DB initializes on start
  ensureDb();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Festival Mega Sale server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
