import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminOrders, useAdminCancelOrder } from '../../hooks/useAdminOrders';
import type { Order, OrderStatus } from '../../interfaces/products';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-900/40 text-yellow-300',
  accepted: 'bg-blue-900/40 text-blue-300',
  going_for_pickup: 'bg-indigo-900/40 text-indigo-300',
  out_for_delivery: 'bg-purple-900/40 text-purple-300',
  reached: 'bg-cyan-900/40 text-cyan-300',
  delivered: 'bg-green-900/40 text-green-300',
  cancelled: 'bg-red-900/40 text-red-300',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  going_for_pickup: 'Going for Pickup',
  out_for_delivery: 'Out for Delivery',
  reached: 'Reached',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const ALL_STATUSES: OrderStatus[] = [
  'pending', 'accepted', 'going_for_pickup', 'out_for_delivery', 'reached', 'delivered', 'cancelled',
];

function formatCurrency(amount: number | string) {
  return `₹${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderRow({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-slate-700 hover:bg-slate-750 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3 text-xs text-slate-400 font-mono">{order.id.slice(0, 8)}…</td>
        <td className="px-4 py-3 text-sm text-slate-200">
          {order.user ? `${order.user.firstName} ${order.user.lastName}` : order.userId.slice(0, 8)}
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-slate-200 text-right">
          {formatCurrency(Number(order.totalAmount) + Number(order.deliveryFee))}
        </td>
        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(order.createdAt)}</td>
        <td className="px-4 py-3 text-right">
          {!order.completed && order.status !== 'cancelled' && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
            >
              Cancel
            </button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-700 bg-slate-600/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Delivery Address</p>
                <p className="text-slate-200">
                  {order.addressSnapshot.line1}
                  {order.addressSnapshot.line2 && `, ${order.addressSnapshot.line2}`}
                  , {order.addressSnapshot.city} {order.addressSnapshot.postcode}
                </p>
              </div>
              {order.deliveryPartner && (
                <div>
                  <p className="text-slate-400 text-xs mb-1">Delivery Partner</p>
                  <p className="text-slate-200">
                    {order.deliveryPartner.firstName} {order.deliveryPartner.lastName}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-slate-400 text-xs mb-2">Items</p>
                <div className="space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-300 text-xs">
                      <span>{item.productName} × {item.quantity}</span>
                    <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-slate-400 text-xs border-t border-slate-700 pt-1 mt-1">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-200 text-xs font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(Number(order.totalAmount) + Number(order.deliveryFee))}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function OrderListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  const { data, isLoading } = useAdminOrders({ page, limit, status: statusFilter || undefined });
  const cancelOrder = useAdminCancelOrder();

  const handleCancel = (orderId: string) => {
    if (!confirm('Cancel this order?')) return;
    cancelOrder.mutate(orderId, {
      onSuccess: () => toast.success('Order cancelled'),
      onError: () => toast.error('Failed to cancel order'),
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 text-sm mt-0.5">All customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        {data && (
          <span className="text-slate-400 text-sm">{data.total} orders</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading orders…</div>
        ) : !data?.data.length ? (
          <div className="p-8 text-center text-slate-400">No orders found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Placed</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.data.map((order) => (
                <OrderRow key={order.id} order={order} onCancel={handleCancel} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm">
            Page {page} of {data.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page === data.pages}
            className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
