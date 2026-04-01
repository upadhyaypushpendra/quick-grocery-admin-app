import { Link } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboard';
import { useAdminOrderStats } from '../hooks/useAdminOrders';

interface StatCardProps {
  label: string;
  value: number | string | undefined;
  color: string;
  icon: string;
  to?: string;
}

function StatCard({ label, value, color, icon, to }: StatCardProps) {
  const inner = (
    <div className={`bg-slate-800 rounded-xl p-5 border border-slate-700 ${to ? 'hover:border-slate-600 transition-colors' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold text-white">
        {value ?? <span className="text-slate-500 text-xl">—</span>}
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
      {children}
    </h2>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: orderStats, isLoading: loadingOrders } = useAdminOrderStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Store overview</p>
      </div>

      {/* Inventory stats */}
      <SectionTitle>Inventory</SectionTitle>
      {loadingStats ? (
        <div className="text-slate-400 text-sm mb-8">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={stats?.totalProducts}
            color="bg-brand-900/50 text-brand-300"
            icon="⊞"
            to="/products"
          />
          <StatCard
            label="Categories"
            value={stats?.totalCategories}
            color="bg-sky-900/50 text-sky-300"
            icon="⊟"
            to="/categories"
          />
          <StatCard
            label="In Stock"
            value={stats?.inStockCount}
            color="bg-green-900/50 text-green-300"
            icon="✓"
          />
          <StatCard
            label="Out of Stock"
            value={stats?.outOfStockCount}
            color="bg-red-900/50 text-red-300"
            icon="✕"
          />
        </div>
      )}

      {/* Order stats */}
      <SectionTitle>Orders</SectionTitle>
      {loadingOrders ? (
        <div className="text-slate-400 text-sm mb-8">Loading…</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Orders"
            value={orderStats?.totalOrders}
            color="bg-brand-900/50 text-brand-300"
            icon="◫"
            to="/orders"
          />
          <StatCard
            label="Revenue"
            value={orderStats?.totalRevenue != null ? `₹${orderStats.totalRevenue.toFixed(0)}` : undefined}
            color="bg-emerald-900/50 text-emerald-300"
            icon="₹"
          />
          <StatCard
            label="Delivered"
            value={orderStats?.byStatus?.delivered}
            color="bg-green-900/50 text-green-300"
            icon="✓"
          />
          <StatCard
            label="Pending"
            value={orderStats?.byStatus?.pending}
            color="bg-yellow-900/50 text-yellow-300"
            icon="⏳"
          />
        </div>
      )}

      {/* Order status breakdown */}
      {orderStats && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 mb-8">
          <p className="text-sm font-medium text-slate-300 mb-3">Order Status Breakdown</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {(
              [
                ['pending', 'Pending', 'text-yellow-300'],
                ['accepted', 'Accepted', 'text-blue-300'],
                ['going_for_pickup', 'Pickup', 'text-indigo-300'],
                ['out_for_delivery', 'Delivering', 'text-purple-300'],
                ['reached', 'Reached', 'text-cyan-300'],
                ['delivered', 'Delivered', 'text-green-300'],
                ['cancelled', 'Cancelled', 'text-red-300'],
              ] as const
            ).map(([key, label, color]) => (
              <div key={key} className="text-center">
                <div className={`text-2xl font-bold ${color}`}>
                  {orderStats.byStatus?.[key] ?? 0}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <SectionTitle>Quick Actions</SectionTitle>
      <div className="grid grid-cols-3 gap-4 max-w-sm">
        <Link
          to="/products"
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-2">⊞</div>
          <div className="text-xs font-medium text-white">Products</div>
        </Link>
        <Link
          to="/categories"
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-2">⊟</div>
          <div className="text-xs font-medium text-white">Categories</div>
        </Link>
        <Link
          to="/orders"
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-2">◫</div>
          <div className="text-xs font-medium text-white">Orders</div>
        </Link>
      </div>
    </div>
  );
}
