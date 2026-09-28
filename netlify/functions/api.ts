// Plain TypeScript Netlify Function Handler (Zero extra dependencies)
export const handler = async (event: any, context: any) => {
  const path = event.path || '';
  const method = event.httpMethod || 'GET';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Basic routes for Netlify serverless deployment
  if (path.includes('/settings')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        website_name: 'Utsav Mega Sale',
        sale_title: 'FESTIVAL MEGA SALE 2026',
        sale_subtitle: 'Celebrate More. Shop More. Save More.',
        sale_description: 'Discover verified festive deals for Diwali, Durga Puja, and Chhath Puja.',
        sale_end_date: new Date(Date.now() + 35 * 86400000).toISOString(),
        banner_notice: '🔥 FESTIVAL SPECIAL OFFERS: Exclusive festival discounts now live across Flipkart, Myntra & Meesho!',
        banner_active: true,
        contact_email: 'support@utsavmegasale.in',
        contact_phone: '+91 98765 43210',
        social_instagram: 'https://instagram.com/utsavmegasale',
        social_telegram: 'https://t.me/utsavmegasale',
        social_whatsapp: 'https://wa.me/919876543210',
        updated_at: new Date().toISOString(),
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Utsav Mega Sale API is active' }),
  };
};
