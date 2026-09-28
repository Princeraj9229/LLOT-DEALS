import React, { useState } from 'react';
import { SaleSettings } from '../../types';
import { api } from '../../lib/api';
import { Save, Check, AlertCircle, Settings, Calendar, Bell, Globe, Mail, Phone } from 'lucide-react';

interface AdminSaleSettingsProps {
  settings: SaleSettings;
  onUpdate: (updated: SaleSettings) => void;
}

export const AdminSaleSettings: React.FC<AdminSaleSettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<SaleSettings>({ ...settings });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date for datetime-local input
  const formattedCountdownDate = React.useMemo(() => {
    try {
      const d = new Date(formData.sale_end_date);
      if (isNaN(d.getTime())) return '';
      // Slice YYYY-MM-DDTHH:mm
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  }, [formData.sale_end_date]);

  const handleDateChange = (val: string) => {
    if (val) {
      const iso = new Date(val).toISOString();
      setFormData((prev) => ({ ...prev, sale_end_date: iso }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.updateSettings(formData);
      onUpdate(res);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-festive text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" />
            <span>Sale Configuration & Branding Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your festival headline, countdown timer, banner announcement, and brand identity.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully! The live website has been updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding & Hero Section */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-amber-600" />
            <span>Website Branding & Hero Texts</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Website Name (Brand)
              </label>
              <input
                type="text"
                required
                value={formData.website_name}
                onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sale Hero Title
              </label>
              <input
                type="text"
                required
                value={formData.sale_title}
                onChange={(e) => setFormData({ ...formData, sale_title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sale Subtitle
              </label>
              <input
                type="text"
                value={formData.sale_subtitle}
                onChange={(e) => setFormData({ ...formData, sale_subtitle: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Sale Description
              </label>
              <textarea
                rows={2}
                value={formData.sale_description}
                onChange={(e) => setFormData({ ...formData, sale_description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>

        {/* Countdown Timer Config */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Sale Countdown Timer</span>
          </h3>

          <div className="max-w-md">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Sale End Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formattedCountdownDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              When this date passes, the live website will automatically display “Sale Ended”.
            </span>
          </div>
        </div>

        {/* Promotional Banner Announcement */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Promotional Announcement Banner</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="banner_active"
                checked={formData.banner_active}
                onChange={(e) => setFormData({ ...formData, banner_active: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <label htmlFor="banner_active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Show announcement banner at the top of Hero section
              </label>
            </div>

            <div>
              <input
                type="text"
                value={formData.banner_notice}
                onChange={(e) => setFormData({ ...formData, banner_notice: e.target.value })}
                placeholder="🔥 FESTIVAL SPECIAL OFFERS: Exclusive festival discounts..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Contact & Social Links</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                WhatsApp Channel Link
              </label>
              <input
                type="url"
                value={formData.social_whatsapp}
                onChange={(e) => setFormData({ ...formData, social_whatsapp: e.target.value })}
                placeholder="https://wa.me/..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Telegram Deals Link
              </label>
              <input
                type="url"
                value={formData.social_telegram}
                onChange={(e) => setFormData({ ...formData, social_telegram: e.target.value })}
                placeholder="https://t.me/..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
