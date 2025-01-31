'use client';
import { useAuth } from '@/context/AuthContext';
import Login from './Login';
import Loader from './Loader';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}
