import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
} from '../../hooks/useAdminCategories';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
});

type FormData = z.infer<typeof schema>;

export default function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: categories } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(id ?? '');

  // Find the category being edited
  const editingCategory = categories?.flatMap((c) => [c, ...(c.children ?? [])]).find(
    (c) => c._id === id,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0 },
  });

  const nameValue = watch('name', '');
  const slugPreview = nameValue
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        slug: editingCategory.slug,
        imageUrl: editingCategory.imageUrl ?? '',
        parentId: editingCategory.parentId ?? '',
        sortOrder: editingCategory.sortOrder,
      });
    }
  }, [editingCategory, reset]);

  const onSubmit = async (values: FormData) => {
    const payload = {
      ...values,
      parentId: values.parentId || null,
      slug: values.slug || undefined,
    };

    if (isEdit) {
      updateCategory.mutate(payload, {
        onSuccess: () => {
          toast.success('Category updated');
          navigate('/categories');
        },
        onError: () => toast.error('Failed to update category'),
      });
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          toast.success('Category created');
          navigate('/categories');
        },
        onError: () => toast.error('Failed to create category'),
      });
    }
  };

  // Only top-level categories as parent options
  const parentOptions = categories?.filter((c) => !c.parentId) ?? [];

  const inputCls =
    'w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="text-slate-400 hover:text-white text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white">
          {isEdit ? 'Edit Category' : 'New Category'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input {...register('name')} className={inputCls} placeholder="Category name" />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Slug{' '}
              <span className="text-slate-500 font-normal">
                (auto-generated if empty)
              </span>
            </label>
            <input
              {...register('slug')}
              className={inputCls}
              placeholder={slugPreview || 'category-slug'}
            />
            {slugPreview && !watch('slug') && (
              <p className="text-slate-500 text-xs mt-1">Will be: {slugPreview}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Parent Category
            </label>
            <select {...register('parentId')} className={inputCls}>
              <option value="">None (top-level)</option>
              {parentOptions.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Image URL</label>
            <input
              {...register('imageUrl')}
              className={inputCls}
              placeholder="https://…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Sort Order</label>
            <input
              type="number"
              {...register('sortOrder')}
              className={inputCls}
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || createCategory.isPending || updateCategory.isPending}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {isEdit ? 'Save Changes' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
