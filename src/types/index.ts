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
