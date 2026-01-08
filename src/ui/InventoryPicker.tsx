import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { fetchInventory } from '@/services/inventory';
import type { InventoryItem, InventoryQuery } from '@/types/inventory';

const PAGE_SIZE = 10;

export default function InventoryPicker({ onClose, onSelect }: { onClose: () => void; onSelect: (item: InventoryItem) => void; }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<InventoryQuery>({ page: 1, pageSize: PAGE_SIZE, sortBy: 'updatedAt', sortDir: 'desc' });
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const { items, pages } = await fetchInventory({ ...query, search });
    setItems(items);
    setPages(pages);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, search]);

  return (
    <View className="absolute inset-0 bg-black/40">
      <View className="m-6 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-800">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-black dark:text-white">Select Inventory</Text>
          <Pressable onPress={onClose} className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700">
            <Text className="text-black dark:text-white">Close</Text>
          </Pressable>
        </View>
        <View className="flex-row gap-2 items-center mb-2">
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white"
            placeholderTextColor="#888"
          />
          <Pressable className="px-3 py-2 rounded-lg bg-brand" onPress={() => setQuery({ ...query, page: 1 })}>
            <Text className="text-white font-semibold">Go</Text>
          </Pressable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          refreshing={loading}
          onRefresh={load}
          contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => onSelect(item)} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-800">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-black dark:text-white">{item.name}</Text>
                <Text className="text-brand font-semibold">Rp {item.price.toLocaleString()}</Text>
              </View>
              <Text className="text-xs text-gray-600 dark:text-gray-300">{item.sku} • {item.category} • {item.metal}</Text>
            </Pressable>
          )}
        />
        <View className="flex-row items-center justify-center gap-2 py-2">
          <Pressable disabled={query.page <= 1} onPress={() => setQuery({ ...query, page: Math.max(1, query.page - 1) })} className={`px-3 py-2 rounded-lg ${query.page <= 1 ? 'bg-gray-200 dark:bg-gray-800' : 'bg-brand'}`}>
            <Text className={`${query.page <= 1 ? 'text-gray-500' : 'text-white'}`}>Prev</Text>
          </Pressable>
          {Array.from({ length: pages }).slice(0, 5).map((_, idx) => {
            const p = idx + 1;
            return (
              <Pressable key={p} onPress={() => setQuery({ ...query, page: p })} className={`px-3 py-2 rounded-lg border ${query.page === p ? 'bg-brand border-brand' : 'border-gray-300 dark:border-gray-700'}`}>
                <Text className={`${query.page === p ? 'text-white' : 'text-black dark:text-white'}`}>{p}</Text>
              </Pressable>
            );
          })}
          <Pressable disabled={query.page >= pages} onPress={() => setQuery({ ...query, page: Math.min(pages, query.page + 1) })} className={`px-3 py-2 rounded-lg ${query.page >= pages ? 'bg-gray-200 dark:bg-gray-800' : 'bg-brand'}`}>
            <Text className={`${query.page >= pages ? 'text-gray-500' : 'text-white'}`}>Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
