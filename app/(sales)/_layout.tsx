import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/state/auth';
import { useTranslation } from 'react-i18next';

export default function SalesLayout() {
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerRight: () => (
          <Pressable onPress={handleLogout} style={{ paddingHorizontal: 12 }}>
            <Text>{t('logout')}</Text>
          </Pressable>
        ),
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          height: 56,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'home') {
            return <MaterialIcons name={focused ? 'home' : 'home-filled'} size={size} color={color} />;
          }
          if (route.name === 'ongoing') {
            return <Feather name="list" size={size} color={color} />;
          }
          if (route.name === 'new-order') {
            return <Feather name="plus-circle" size={size} color={color} />;
          }
          if (route.name === 'notifications') {
            return <Feather name="bell" size={size} color={color} />;
          }
          if (route.name === 'profile') {
            return <Feather name="user" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: t('home') }} />
      <Tabs.Screen name="ongoing" options={{ title: t('ongoing') }} />
      <Tabs.Screen name="new-order" options={{ title: t('newOrder') }} />
      <Tabs.Screen name="notifications" options={{ title: t('notification') }} />
      <Tabs.Screen name="profile" options={{ title: t('profile') }} />
    </Tabs>
  );
}
