import { useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuthStore } from '@/state/auth';

const ROLES = [
  { key: 'sales', label: 'Sales' },
  { key: 'designer', label: 'Designer' },
  { key: 'carver', label: 'Carver' },
  { key: 'caster', label: 'Caster' },
  { key: 'diamondsetter', label: 'Diamond Setter' },
  { key: 'finisher', label: 'Finisher' },
  { key: 'inventory', label: 'Inventory' }
] as const;

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSelect = (role: any) => {
    login(role);
    if (role === 'sales') router.replace('/(sales)');
    else if (role === 'inventory') router.replace('/(inventory)');
    else router.replace('/(worker)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role to Login</Text>
      <View style={styles.grid}>
        {ROLES.map((r) => (
          <Pressable key={r.key} style={styles.card} onPress={() => handleSelect(r.key)}>
            <Text style={styles.cardText}>{r.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  card: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, minWidth: 140, alignItems: 'center' },
  cardText: { fontSize: 16, fontWeight: '600' }
});
