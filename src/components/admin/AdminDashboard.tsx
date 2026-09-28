import React from 'react';
import { DashboardStats } from '../../types';
import { Package, Eye, EyeOff, MousePointerClick, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { DiyaIcon, DurgaPujaMotif, ChhathPujaSun, PlatformBadge } from '../FestiveIcons';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  loading: boolean;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, loading, onRefresh }) => {
  if (loading || !stats) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-500">
        <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-slate-400">in catalog</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Deals
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
              {stats.activeProducts}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">live on store</span>
          </div>
        </div>

        {/* Hidden Products */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hidden Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 tabular-nums">
              {stats.hiddenProducts}
            </span>
            <span className="text-[11px] text-slate-400">draft / paused</span>
          </div>
        </div>

        {/* Buy Now Clicks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Buy Now Clicks
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 tabular-nums">
              {stats.totalClicks}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">affiliate redirects</span>
          </div>
        </div>
      </div>

      {/* Breakdowns Grid: Festivals & Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products by Festival */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Products by Festival</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <div className="flex items-center gap-2.5">
                <DiyaIcon size={20} className="text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Diwali Deals</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-900 tabular-nums">
                {stats.festivalBreakdown.diwali || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-200/60">
              <div className="flex items-center gap-2.5">
                <DurgaPujaMotif size={20} className="text-rose-600" />
                <span className="text-xs font-semibold text-slate-800">Durga Puja Picks</span>
              </div>
              <span className="font-mono text-sm font-bold text-rose-900 tabular-nums">
                {stats.festivalBreakdown.durga_puja || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
              <div className="flex items-center gap-2.5">
                <ChhathPujaSun size={20} className="text-orange-600" />
                <span className="text-xs font-semibold text-slate-800">Chhath Puja Collection</span>
              </div>
              <span className="font-mono text-sm font-bold text-orange-900 tabular-nums">
                {stats.festivalBreakdown.chhath_puja || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Products & Clicks by Platform */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Platform Performance & Clicks</span>
          </h3>
          <div className="space-y-3">
            {/* Flipkart */}
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 block">Flipkart</span>
                <span className="text-[11px] text-slate-500">
                  {stats.platformBreakdown.Flipkart || 0} active products
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-blue-900 font-mono tabular-nums">
                  {stats.platformClicks.Flipkart || 0}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">Clicks</span>
              </div>
            </div>

            {/* Myntra */}
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 block">Myntra</span>
                <span className="text-[11px] text-slate-500">
                  {stats.platformBreakdown.Myntra || 0} active products
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-rose-900 font-mono tabular-nums">
                  {stats.platformClicks.Myntra || 0}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">Clicks</span>
              </div>
            </div>

            {/* Meesho */}
            <div className="p-3 rounded-xl bg-fuchsia-50/50 border border-fuchsia-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-fuchsia-700 block">Meesho</span>
                <span className="text-[11px] text-slate-500">
                  {stats.platformBreakdown.Meesho || 0} active products
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-fuchsia-900 font-mono tabular-nums">
                  {stats.platformClicks.Meesho || 0}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase">Clicks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Click Stream */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-amber-600" />
            <span>Recent Buy Now Click Stream</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Latest 50 events</span>
        </div>

        {stats.recentClicks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Festival</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentClicks.map((click) => (
                  <tr key={click.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(click.clicked_at).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 line-clamp-1 max-w-xs">
                      {click.product_name}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-700">
                        {click.platform}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 capitalize text-slate-500">
                      {click.festival.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-400">
            No clicks recorded yet. When visitors click "BUY NOW", live events will appear here!
          </div>
        )}
      </div>
    </div>
  );
};
