# 🪔 Utsav Mega Sale 2026 — Festival Affiliate Shopping Website

An Indian Festive Mega Sale affiliate discovery platform celebrating the three major festivals:
- 🪔 **Diwali** (Diyas, LED fairy lights, pooja thalis, ethnic fashion, festive hampers)
- 🌺 **Durga Puja** (Authentic Bengali tant & lal paar sarees, brass dhunachi, terracotta jewelry)
- 🌅 **Chhath Puja** (Handmade bamboo soop & daura, heavy gauge brass Surya arghya kalash, thekua moulds, yellow sarees)

Visitors browse genuine discounts across **Flipkart**, **Myntra**, and **Meesho**. When they click **"BUY NOW"**, their click is recorded in the analytics database and they are seamlessly redirected to the official merchant via the exact affiliate URL configured by the administrator.

> **Important Trust Architecture**: This website is an affiliate portal and **never** processes payments, collects customer bank details, or takes shipping addresses. All checkout and product deliveries are fulfilled by Flipkart, Myntra, or Meesho.

---

## 🚀 Key Features

1. **Festive Indian Branding & Atmosphere**:
   - Modern, high-trust aesthetic with warm golden tones, terracotta accents, glowing diya animations, and festive decorations.
   - Respects `prefers-reduced-motion` for accessibility.
   - Mobile-first responsiveness (2-column grid on phones, sticky navigation, quick filters).

2. **Live Sale Countdown Timer**:
   - Displays `Days : Hours : Minutes : Seconds` using tabular numerals.
   - Admin-configurable end date and time.
   - Automatically switches to an attractive **“Sale Ended”** banner once the timer expires.

3. **Curated Festival Categories & Deal Showcases**:
   - Three large immersive category cards for Durga Puja, Diwali, and Chhath Puja.
   - **🔥 Trending Festival Deals**: Admin-curated featured products.
   - **⚡ Limited-Time Festival Deals**: Flash discount picks.

4. **Product Catalog & Filters**:
   - Instant live search by product name, festival, platform, or keyword (e.g. *kurti, diya, saree*).
   - Filter by Festival: *All, Diwali, Durga Puja, Chhath Puja*.
   - Filter by Platform: *All, Flipkart, Myntra, Meesho*.
   - Filter by Price Range: *Under ₹500, ₹500–₹1,000, ₹1,000–₹2,000, Above ₹2,000*.
   - Sort by: *Featured Deals, Highest Discount %, Price Low to High, Price High to Low, Newest*.

5. **Secure Admin Dashboard (`/admin`)**:
   - Protected by token-based authentication.
   - **Metrics Overview**: Total Products, Active Deals, Hidden Products, and Total Buy Now Clicks.
   - **Visual Breakdowns**: Products by Festival, Products by Platform, and Platform Clicks.
   - **Live Click Stream**: Real-time log of the latest 50 affiliate clicks.
   - **Product CRUD**: Add, edit, delete (with confirmation modal), hide/show, mark as trending or limited-time deal.
   - **Automatic Discount Calculation**: Simply enter original and sale prices.
   - **Batch Demo Controls**: One-click deletion of all demo products, and one-click reset for testing.
   - **Sale Settings Editor**: Change website name, sale headline, countdown date, announcement banner, contact info, and social links with instant live persistence without modifying code.

---

## 🔐 Admin Credentials

- **URL**: Navigate to `/admin` or click the **Admin** button in the header.
- **Default Username**: `admin`
- **Default Password**: `UtsavAdmin@2026`
*(Can be customized via the `ADMIN_PASSWORD` environment variable).*

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Motion.
- **Backend / API**: Node.js, Express, TSX.
- **Database**: Persistent JSON document store in `data/database.json` with synchronous atomic writes.
- **Build Tool**: Vite 8.

---

## 💻 Local Development & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server** (Full-Stack Express + Vite):
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Compile / Lint Check**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🌐 Netlify Deployment Guide

The repository includes a ready-to-deploy `netlify.toml` and Netlify serverless function configuration.

### 1. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node Version**: `20`

### 2. Environment Variables on Netlify
In your Netlify Site dashboard under **Site configuration > Environment variables**, add:
- `ADMIN_USERNAME`: `admin` (or your chosen username)
- `ADMIN_PASSWORD`: Your secure strong password
- `ADMIN_SECRET`: A random 32-character secret string

### 3. Deploy Steps
1. Push your repository to GitHub / GitLab.
2. In Netlify, click **Add new site > Import an existing project**.
3. Select your repository. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set the environment variables.
5. Click **Deploy Site**.

---

## 📊 Database Schema

Stored in `data/database.json`:

### `products` table
- `id`: Unique identifier (string)
- `name`: Product title (string)
- `image`: Image URL (string)
- `original_price`: Number (₹)
- `sale_price`: Number (₹)
- `discount`: Percentage discount (number, auto-calculated)
- `festival`: `'diwali' | 'durga_puja' | 'chhath_puja' | 'all'`
- `platform`: `'Flipkart' | 'Myntra' | 'Meesho'`
- `affiliate_url`: Full target redirect affiliate link (string)
- `description`: Text overview (string)
- `active`: Boolean visibility flag
- `featured`: Boolean trending flag
- `limited_time`: Boolean limited-time deal flag
- `is_demo`: Boolean sample flag (allows 1-click batch deletion)
- `clicks_count`: Number of recorded clicks
- `created_at`: ISO timestamp

### `clicks` table
- `id`: Unique click record ID
- `product_id`: Associated product ID
- `product_name`: Snapshot product title
- `platform`: Target shopping platform
- `festival`: Festival category
- `clicked_at`: ISO timestamp

### `settings` table
- `website_name`: Branding title (e.g., `Utsav Mega Sale`)
- `sale_title`: Headline (e.g., `FESTIVAL MEGA SALE 2026`)
- `sale_subtitle`: Subheading
- `sale_description`: About paragraph
- `sale_end_date`: ISO datetime for countdown
- `banner_notice`: Promotional banner text
- `banner_active`: Boolean banner visibility
- `contact_email`, `contact_phone`, `social_instagram`, `social_telegram`, `social_whatsapp`
