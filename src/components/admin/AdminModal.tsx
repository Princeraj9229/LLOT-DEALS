import React, { useState, useEffect } from 'react';
import { Product, SaleSettings, DashboardStats } from '../../types';
import { api } from '../../lib/api';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProductList } from './AdminProductList';
import { AdminProductForm } from './AdminProductForm';
import { AdminSaleSettings } from './AdminSaleSettings';
import { DiyaIcon } from '../FestiveIcons';
import { LayoutDashboard, Package, PlusCircle, Settings, LogOut, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SaleSettings;
  onSettingsUpdate: (settings: SaleSettings) => void;
  onProductsChanged: () => void;
}

type Tab = 'dashboard' | 'products' | 'add_product' | 'settings';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsUpdate,
  onProductsChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Check auth status on open
  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const checkAuth = async () => {
    const authed = await api.verifyAuth();
    setIsAuthenticated(authed);
    if (authed) {
      loadAdminData();
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [stats, products] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminProducts(),
      ]);
      setDashboardStats(stats);
      setAdminProducts(products);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
  };

  if (!isOpen) return null;

  // Not authenticated? Show Login
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          loadAdminData();
        }}
        onCancel={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-3xl w-full max-w-6xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Admin Top Header */}
        <header className="bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <DiyaIcon size={18} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold font-festive block leading-tight text-amber-200">
                {settings.website_name} — Admin Console
              </span>
              <span className="text-[10px] text-slate-400 block">
                Manage products, affiliate tracking & sale settings
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="text-xs text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Store</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-rose-300 hover:text-rose-100 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 transition-colors flex items-center gap-1.5"
              title="Logout from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-5 pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setEditingProduct(null);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Management ({adminProducts.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('add_product');
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add_product' && !editingProduct
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setEditingProduct(null);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sale Settings</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              stats={dashboardStats}
              loading={loading}
              onRefresh={loadAdminData}
            />
          )}

          {activeTab === 'products' && !editingProduct && (
            <AdminProductList
              products={adminProducts}
              onAddClick={() => {
                setEditingProduct(null);
                setActiveTab('add_product');
              }}
              onEditClick={(prod) => {
                setEditingProduct(prod);
                setActiveTab('add_product');
              }}
              onRefresh={() => {
                loadAdminData();
                onProductsChanged();
              }}
            />
          )}

          {activeTab === 'add_product' && (
            <AdminProductForm
              initialProduct={editingProduct}
              onSuccess={() => {
                loadAdminData();
                onProductsChanged();
                setEditingProduct(null);
                setActiveTab('products');
              }}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSaleSettings
              settings={settings}
              onUpdate={(updated) => {
                onSettingsUpdate(updated);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
