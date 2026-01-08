import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { fetchInventory } from '@/services/inventory';
import type { InventoryItem, InventoryQuery, SortBy, SortDir } from '@/types/inventory';

const PAGE_SIZE = 10;

export default function InventoryStok() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<InventoryQuery>({ page: 1, pageSize: PAGE_SIZE, sortBy: 'updatedAt', sortDir: 'desc' });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | any>('all');
  const [metal, setMetal] = useState<'all' | any>('all');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const load = async () => {
    setLoading(true);
    const { items, pages } = await fetchInventory({ ...query, search, category, metal, sortBy, sortDir });
    setItems(items);
    setPages(pages);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, search, category, metal, sortBy, sortDir]);

  const categories = ['all', 'ring', 'necklace', 'bracelet', 'earring', 'pendant'] as const;
  const metals = ['all', 'gold', 'silver', 'platinum'] as const;
  const sorters: { key: SortBy; label: string }[] = [
    { key: 'updatedAt', label: 'Updated' },
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' }
  ];

  return (
    <View className="flex-1 p-4 gap-3 bg-white dark:bg-black">
      <Text className="text-xl font-bold text-black dark:text-white">Inventory</Text>
      <View className="flex-row gap-2 items-center">
        <TextInput
          placeholder="Search SKU/Name"
          value={search}
          onChangeText={setSearch}
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white"
          placeholderTextColor="#888"
        />
        <Pressable className="px-3 py-2 rounded-lg bg-brand" onPress={() => setQuery({ ...query, page: 1 })}>
          <Text className="text-white font-semibold">Go</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-2 flex-wrap">
        {categories.map((c) => (
          <Pressable key={c} onPress={() => { setCategory(c); setQuery({ ...query, page: 1 }); }} className={`px-3 py-2 rounded-full border ${category === c ? 'bg-brand border-brand' : 'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${category === c ? 'text-white' : 'text-black dark:text-white'}`}>{String(c)}</Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row gap-2 flex-wrap">
        {metals.map((m) => (
          <Pressable key={m} onPress={() => { setMetal(m); setQuery({ ...query, page: 1 }); }} className={`px-3 py-2 rounded-full border ${metal === m ? 'bg-brand border-brand' : 'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${metal === m ? 'text-white' : 'text-black dark:text-white'}`}>{String(m)}</Text>
          </Pressable>
        ))}
      </View>

      <View className="flex-row gap-2 items-center">
        {sorters.map((s) => (
          <Pressable key={s.key} onPress={() => setSortBy(s.key)} className={`px-3 py-2 rounded-lg border ${sortBy === s.key ? 'bg-brand border-brand' : 'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${sortBy === s.key ? 'text-white' : 'text-black dark:text-white'}`}>{s.label}</Text>
          </Pressable>
        ))}
        <Pressable onPress={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700">
          <Text className="text-black dark:text-white">{sortDir.toUpperCase()}</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-black dark:text-white">{item.name}</Text>
              <Text className="text-brand font-semibold">Rp {item.price.toLocaleString()}</Text>
            </View>
            <Text className="text-xs text-gray-600 dark:text-gray-300">{item.sku} • {item.category} • {item.metal}</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-sm text-gray-700 dark:text-gray-200">Stock: {item.stock}</Text>
              <Text className="text-xs text-gray-500">Updated: {new Date(item.updatedAt).toLocaleDateString()}</Text>
            </View>
          </View>
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
  );
}
