import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminProducts, useDeleteProduct } from '../../hooks/useAdminProducts';
import { useAdminCategories } from '../../hooks/useAdminCategories';

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [inStock, setInStock] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useAdminProducts({ page, limit: 20, search, categoryId: categoryId || undefined, inStock });
  const { data: categories } = useAdminCategories();
  const deleteProduct = useDeleteProduct();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = useCallback(
    (id: string, name: string) => {
      if (!confirm(`Delete "${name}"?`)) return;
      deleteProduct.mutate(id, {
        onSuccess: () => toast.success('Product deleted'),
        onError: () => toast.error('Failed to delete product'),
      });
    },
    [deleteProduct],
  );

  // Flatten categories for filter dropdown
  const flatCategories =
    categories?.flatMap((parent) => [
      parent,
      ...(parent.children ?? []),
    ]) ?? [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Products</h1>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products…"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          {flatCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.parentId ? `  └ ${cat.name}` : cat.name}
            </option>
          ))}
        </select>
        <select
          value={inStock === undefined ? '' : String(inStock)}
          onChange={(e) => {
            setInStock(e.target.value === '' ? undefined : e.target.value === 'true');
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-4 py-3 text-slate-400 font-medium">Product</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Price</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Stock</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No products found
                  </td>
                </tr>
              )}
              {data?.data.map((product) => (
                <tr key={product._id} className="border-b border-slate-700 hover:bg-slate-750">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-9 h-9 rounded object-cover bg-slate-600"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded bg-slate-600 flex items-center justify-center text-slate-400 text-xs">
                          ?
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-slate-400">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white">
                    ₹{product.price.toFixed(2)}
                    {product.comparePrice && (
                      <span className="ml-1 text-xs text-slate-400 line-through">
                        ₹{product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{product.stockQty}</td>
                  <td className="px-4 py-3">
                    {product.inStock ? (
                      <span className="px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full text-xs font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-900/50 text-red-400 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product._id}/edit`}
                        className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 text-xs rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-400">
            Page {data.page} of {data.pages} ({data.total} products)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-sm rounded transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-sm rounded transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
