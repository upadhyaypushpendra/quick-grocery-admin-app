import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminCategories, useDeleteCategory } from '../../hooks/useAdminCategories';
import type { Category } from '../../interfaces/products';

interface CategoryRowProps {
  category: Category;
  isChild?: boolean;
  onDelete: (id: string, name: string) => void;
}

function CategoryRow({ category, isChild, onDelete }: CategoryRowProps) {
  return (
    <>
      <tr className="border-b border-slate-700 hover:bg-slate-750">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isChild && <span className="text-slate-500 ml-4">└</span>}
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-8 h-8 rounded object-cover bg-slate-600"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-slate-600 flex items-center justify-center text-slate-400 text-xs">
                ?
              </div>
            )}
            <div>
              <div className={`font-medium ${isChild ? 'text-slate-300' : 'text-white'}`}>
                {category.name}
              </div>
              <div className="text-xs text-slate-500">{category.slug}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-slate-400 text-sm">
          {category.parentId ? 'Subcategory' : <span className="text-brand-400">Parent</span>}
        </td>
        <td className="px-4 py-3 text-slate-400 text-sm">{category.sortOrder}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              to={`/categories/${category._id}/edit`}
              className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(category._id, category.name)}
              className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 text-xs rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {category.children?.map((child) => (
        <CategoryRow key={child._id} category={child} isChild onDelete={onDelete} />
      ))}
    </>
  );
}

export default function CategoryListPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: (error: unknown) => {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to delete category';
        toast.error(msg);
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Categories</h1>
        <Link
          to="/categories/new"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="px-4 py-3 text-slate-400 font-medium">Category</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Type</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Sort Order</th>
                <th className="px-4 py-3 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!categories?.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No categories yet
                  </td>
                </tr>
              )}
              {categories?.map((category) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
