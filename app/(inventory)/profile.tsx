import { View, Text, Button, Pressable } from 'react-native';
import { useAuthStore } from '@/state/auth';
import { useUIStore } from '@/state/ui';
import i18n from '@/i18n';

export default function InventoryProfile() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <View className="flex-1 p-4 gap-3 bg-white dark:bg-black">
      <Text className="text-xl font-bold text-black dark:text-white">Profile</Text>
      <ThemeLanguageSection />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

function ThemeLanguageSection() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  return (
    <View className="gap-2">
      <Text className="text-black dark:text-white">Theme</Text>
      <View className="flex-row gap-2">
        {(['system','light','dark'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTheme(t)} className={`px-3 py-2 rounded-lg border ${theme===t?'bg-brand border-brand':'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${theme===t?'text-white':'text-black dark:text-white'}`}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <Text className="text-black dark:text-white mt-2">Language</Text>
      <View className="flex-row gap-2">
        {(['id','en'] as const).map((lng) => (
          <Pressable key={lng} onPress={() => i18n.changeLanguage(lng)} className={`px-3 py-2 rounded-lg border ${i18n.language.startsWith(lng)?'bg-brand border-brand':'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${i18n.language.startsWith(lng)?'text-white':'text-black dark:text-white'}`}>{lng.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
