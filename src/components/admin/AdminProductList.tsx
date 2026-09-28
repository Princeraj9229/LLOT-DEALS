import React, { useState } from 'react';
import { Product } from '../../types';
import { PlatformBadge } from '../FestiveIcons';
import { Edit2, Trash2, Eye, EyeOff, Flame, Zap, Plus, AlertTriangle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

interface AdminProductListProps {
  products: Product[];
  onAddClick: () => void;
  onEditClick: (product: Product) => void;
  onRefresh: () => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  products,
  onAddClick,
  onEditClick,
  onRefresh,
}) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [demoActionLoading, setDemoActionLoading] = useState(false);
  const [filterFestival, setFilterFestival] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = products.filter((p) => {
    if (filterFestival !== 'all' && p.festival !== filterFestival) return false;
    if (filterPlatform !== 'all' && p.platform.toLowerCase() !== filterPlatform.toLowerCase())
      return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.platform.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStatus = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { active: !product.active });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { featured: !product.featured });
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteLoading(true);
    try {
      await api.deleteProduct(productToDelete.id);
      setProductToDelete(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteDemo = async () => {
    if (!window.confirm('Are you sure you want to remove all sample DEMO products?')) return;
    setDemoActionLoading(true);
    try {
      await api.deleteDemoProducts();
      onRefresh();
    } catch (err) {
      console.error('Failed to delete demos:', err);
    } finally {
      setDemoActionLoading(false);
    }
  };

  const handleResetDemo = async () => {
    setDemoActionLoading(true);
    try {
      await api.resetDemoProducts();
      onRefresh();
    } catch (err) {
      console.error('Failed to reset demos:', err);
    } finally {
      setDemoActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
          />

          <select
            value={filterFestival}
            onChange={(e) => setFilterFestival(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">All Festivals</option>
            <option value="diwali">Diwali</option>
            <option value="durga_puja">Durga Puja</option>
            <option value="chhath_puja">Chhath Puja</option>
          </select>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">All Platforms</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Myntra">Myntra</option>
            <option value="Meesho">Meesho</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo Data Controls */}
          <button
            onClick={handleDeleteDemo}
            disabled={demoActionLoading}
            className="px-3 py-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors whitespace-nowrap"
            title="Delete all demo products"
          >
            Delete Demo Products
          </button>

          <button
            onClick={handleResetDemo}
            disabled={demoActionLoading}
            className="px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
            title="Restore sample demo products"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demos</span>
          </button>

          <button
            onClick={onAddClick}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Festival</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Price & Discount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Clicks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Thumbnail */}
                  <td className="py-2.5 px-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-100 shrink-0"
                    />
                  </td>

                  {/* Name & Flags */}
                  <td className="py-2.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 line-clamp-1">{prod.name}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {prod.is_demo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-200 uppercase">
                          Demo
                        </span>
                      )}
                      {prod.featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>Trending</span>
                        </span>
                      )}
                      {prod.limited_time && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5 fill-current" />
                          <span>Deal</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Festival */}
                  <td className="py-2.5 px-4 capitalize whitespace-nowrap">
                    {prod.festival.replace('_', ' ')}
                  </td>

                  {/* Platform */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <PlatformBadge platform={prod.platform} />
                  </td>

                  {/* Pricing */}
                  <td className="py-2.5 px-4 whitespace-nowrap font-mono tabular-nums">
                    <div className="font-bold text-slate-900">
                      ₹{prod.sale_price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 line-through">
                      ₹{prod.original_price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-600">
                      {prod.discount}% off
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(prod)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        prod.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {prod.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{prod.active ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>

                  {/* Clicks */}
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-700 tabular-nums">
                    {prod.clicks_count || 0}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        title={prod.featured ? 'Remove from Trending' : 'Mark as Trending'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prod.featured
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-amber-600'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEditClick(prod)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">
              Delete Product?
            </h3>
            <p className="text-xs text-center text-slate-500 mt-1 mb-5">
              Are you sure you want to delete "<strong>{productToDelete.name}</strong>"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
