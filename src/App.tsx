import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import AdminShell from './components/layout/AdminShell';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductListPage from './pages/products/ProductListPage';
import ProductFormPage from './pages/products/ProductFormPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import OrderListPage from './pages/orders/OrderListPage';
import { useMe } from './hooks/useAuth';
import { useAuthStore } from './stores/authStore';

function AuthInitializer() {
  const me = useMe();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (me.data) {
      setAuth(me.data.user, me.data.accessToken);
    }
  }, [me.data, setAuth]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="orders" element={<OrderListPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
