import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useUIStore } from '@/state/ui';
import '@/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({});
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return <Slot />;
}
