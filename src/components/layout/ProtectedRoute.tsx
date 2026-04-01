import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
