import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { fetchOrders } from '@/services/orders';
import type { Order, OrderQuery, OrderStatus, OrderSortBy, OrderSortDir } from '@/types/order';

const PAGE_SIZE = 10;

const statusColors: Record<OrderStatus, string> = {
  draft: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
  ongoing: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200',
  completed: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',
  cancelled: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200',
};

export default function SalesOngoing() {
  const [items, setItems] = useState<Order[]>([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<OrderQuery>({ page: 1, pageSize: PAGE_SIZE, sortBy: 'updatedAt', sortDir: 'desc', status: 'ongoing' });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('ongoing');
  const [sortBy, setSortBy] = useState<OrderSortBy>('updatedAt');
  const [sortDir, setSortDir] = useState<OrderSortDir>('desc');

  const load = async () => {
    setLoading(true);
    const { items, pages } = await fetchOrders({ ...query, search, status, sortBy, sortDir });
    setItems(items);
    setPages(pages);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, search, status, sortBy, sortDir]);

  const statuses: (OrderStatus | 'all')[] = ['all','draft','ongoing','completed','cancelled'];
  const sorters: { key: OrderSortBy; label: string }[] = [
    { key: 'updatedAt', label: 'Updated' },
    { key: 'customerName', label: 'Customer' },
    { key: 'total', label: 'Total' }
  ];

  return (
    <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <View className="px-4 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90">
        <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Ongoing Orders</Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor pesanan berjalan, filter berdasarkan status dan pelanggan.
        </Text>
      </View>

      <View className="p-4 gap-3">
        <View className="flex-row gap-2 items-center">
        <TextInput
          placeholder="Search Code/Customer"
          value={search}
          onChangeText={setSearch}
          className="flex-1 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900"
          placeholderTextColor="#888"
        />
        <Pressable className="px-3 py-2 rounded-xl bg-brand" onPress={() => setQuery({ ...query, page: 1 })}>
          <Text className="text-white font-semibold">Cari</Text>
        </Pressable>
      </View>

        <View className="flex-row gap-2 flex-wrap mt-1">
        {statuses.map((s) => (
          <Pressable key={s} onPress={() => { setStatus(s); setQuery({ ...query, page: 1 }); }} className={`px-3 py-2 rounded-full border ${status === s ? 'bg-brand border-brand' : 'border-gray-300 dark:border-gray-700'}`}>
            <Text className={`${status === s ? 'text-white' : 'text-black dark:text-white'}`}>{String(s)}</Text>
          </Pressable>
        ))}
      </View>

        <View className="flex-row gap-2 items-center mt-1">
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
          <Link href={`/(sales)/order/${item.id}`} asChild>
            <Pressable className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-semibold text-zinc-900 dark:text-zinc-50">{item.code}</Text>
                <View className={`px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>
                  <Text className="text-[11px] font-semibold capitalize">{item.status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-xs text-zinc-600 dark:text-zinc-300">{item.customerName} • {item.items.length} items</Text>
                <Text className="text-brand font-semibold text-sm">Rp {item.total.toLocaleString()}</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-[11px] text-zinc-500 dark:text-zinc-400">Updated {new Date(item.updatedAt).toLocaleString()}</Text>
                <Text className="text-[11px] text-zinc-400">Created {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
            </Pressable>
          </Link>
        )}
      />
      </View>

      <View className="flex-row items-center justify-center gap-2 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90">
        <Pressable
          disabled={query.page <= 1}
          onPress={() => setQuery({ ...query, page: Math.max(1, query.page - 1) })}
          className={`px-3 py-2 rounded-lg min-w-[72px] items-center ${query.page <= 1 ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-brand'}`}
        >
          <Text className={`${query.page <= 1 ? 'text-zinc-500' : 'text-white'}`}>Prev</Text>
        </Pressable>
        {Array.from({ length: pages }).slice(0, 5).map((_, idx) => {
          const p = idx + 1;
          return (
            <Pressable
              key={p}
              onPress={() => setQuery({ ...query, page: p })}
              className={`px-3 py-2 rounded-lg border min-w-[40px] items-center ${
                query.page === p ? 'bg-brand border-brand' : 'border-zinc-300 dark:border-zinc-700'
              }`}
            >
              <Text className={`${query.page === p ? 'text-white' : 'text-zinc-900 dark:text-zinc-50'}`}>{p}</Text>
            </Pressable>
          );
        })}
        <Pressable
          disabled={query.page >= pages}
          onPress={() => setQuery({ ...query, page: Math.min(pages, query.page + 1) })}
          className={`px-3 py-2 rounded-lg min-w-[72px] items-center ${query.page >= pages ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-brand'}`}
        >
          <Text className={`${query.page >= pages ? 'text-zinc-500' : 'text-white'}`}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
