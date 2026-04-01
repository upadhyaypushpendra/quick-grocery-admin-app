import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  useAdminProduct,
  useCreateProduct,
  useUpdateProduct,
} from '../../hooks/useAdminProducts';
import { useAdminCategories } from '../../hooks/useAdminCategories';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  comparePrice: z.coerce.number().min(0).optional().or(z.literal('')),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  inStock: z.boolean().default(true),
  stockQty: z.coerce.number().min(0).default(0),
  unit: z.string().optional(),
  brand: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: product, isLoading: productLoading } = useAdminProduct(id ?? '');
  const { data: categories } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inStock: true, stockQty: 0 },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        comparePrice: product.comparePrice ?? '',
        imageUrl: product.imageUrl ?? '',
        categoryId: product.categoryId,
        tags: product.tags?.join(', ') ?? '',
        inStock: product.inStock,
        stockQty: product.stockQty,
        unit: product.unit ?? '',
        brand: product.brand ?? '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (values: FormData) => {
    const payload = {
      ...values,
      tags: values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      comparePrice: values.comparePrice === '' ? undefined : Number(values.comparePrice),
    };

    if (isEdit) {
      updateProduct.mutate(payload, {
        onSuccess: () => {
          toast.success('Product updated');
          navigate('/products');
        },
        onError: () => toast.error('Failed to update product'),
      });
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          toast.success('Product created');
          navigate('/products');
        },
        onError: () => toast.error('Failed to create product'),
      });
    }
  };

  if (isEdit && productLoading) {
    return <div className="p-6 text-slate-400">Loading…</div>;
  }

  // Flatten categories for select
  const flatCategories =
    categories?.flatMap((parent) => [
      { ...parent, isParent: true },
      ...(parent.children ?? []).map((c) => ({ ...c, isParent: false })),
    ]) ?? [];

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/products')}
          className="text-slate-400 hover:text-white text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-white">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Basic Info
          </h2>

          <Field label="Name" error={errors.name?.message}>
            <input {...register('name')} className={inputCls} placeholder="Product name" />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={3}
              className={inputCls}
              placeholder="Product description"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₹)" error={errors.price?.message}>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={inputCls}
                placeholder="0.00"
              />
            </Field>
            <Field label="Compare Price (₹)" error={errors.comparePrice?.message}>
              <input
                type="number"
                step="0.01"
                {...register('comparePrice')}
                className={inputCls}
                placeholder="Optional"
              />
            </Field>
          </div>

          <Field label="Category" error={errors.categoryId?.message}>
            <select {...register('categoryId')} className={inputCls}>
              <option value="">Select category…</option>
              {flatCategories.map((cat) => (
                <option key={cat._id} value={cat._id} disabled={cat.isParent}>
                  {cat.isParent ? cat.name : `  └ ${cat.name}`}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand" error={errors.brand?.message}>
              <input {...register('brand')} className={inputCls} placeholder="Brand name" />
            </Field>
            <Field label="Unit" error={errors.unit?.message}>
              <input {...register('unit')} className={inputCls} placeholder="e.g. 500g" />
            </Field>
          </div>

          <Field label="Tags (comma-separated)" error={errors.tags?.message}>
            <input
              {...register('tags')}
              className={inputCls}
              placeholder="organic, fresh, vegan"
            />
          </Field>

          <Field label="Image URL" error={errors.imageUrl?.message}>
            <input {...register('imageUrl')} className={inputCls} placeholder="https://…" />
          </Field>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Inventory
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock Quantity" error={errors.stockQty?.message}>
              <input
                type="number"
                {...register('stockQty')}
                className={inputCls}
                placeholder="0"
              />
            </Field>
            <Field label="Status">
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('inStock')}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-brand-600"
                />
                <span className="text-sm text-slate-300">In Stock</span>
              </label>
            </Field>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || createProduct.isPending || updateProduct.isPending}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
