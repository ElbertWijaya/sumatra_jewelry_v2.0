import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useAuthStore } from '@/src/state/auth';

export default function SalesLayout() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <Tabs screenOptions={{ headerRight: () => (
      <Pressable onPress={logout} style={{ paddingHorizontal: 12 }}>
        <Text>Logout</Text>
      </Pressable>
    ) }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="ongoing" options={{ title: 'Ongoing' }} />
      <Tabs.Screen name="new-order" options={{ title: 'New Order' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notification' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
