import { Redirect } from 'expo-router';
import { useAuthStore } from '@/state/auth';

export default function Index() {
  const role = useAuthStore((s) => s.role);
  if (!role) return <Redirect href="/(auth)/login" />;
  if (role === 'sales') return <Redirect href="/(sales)" />;
  if (role === 'inventory') return <Redirect href="/(inventory)" />;
  return <Redirect href="/(worker)" />;
}
