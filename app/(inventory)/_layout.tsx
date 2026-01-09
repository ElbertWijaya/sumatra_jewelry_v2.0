import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useAuthStore } from '@/state/auth';
import { useTranslation } from 'react-i18next';

export default function InventoryLayout() {
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };
  return (
    <Tabs screenOptions={{ headerRight: () => (
      <Pressable onPress={handleLogout} style={{ paddingHorizontal: 12 }}>
        <Text>{t('logout')}</Text>
      </Pressable>
    ) }}>
      <Tabs.Screen name="home" options={{ title: t('home') }} />
      <Tabs.Screen name="stok" options={{ title: t('stok') }} />
      <Tabs.Screen name="new-inventory" options={{ title: t('newInventory') }} />
      <Tabs.Screen name="notifications" options={{ title: t('notification') }} />
      <Tabs.Screen name="profile" options={{ title: t('profile') }} />
    </Tabs>
  );
}
