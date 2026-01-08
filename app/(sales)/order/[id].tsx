import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, Pressable, FlatList, TextInput } from 'react-native';
import { getOrder, updateOrderStatus } from '@/services/orders';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_FLOW: OrderStatus[] = ['draft','ongoing','completed'];

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await getOrder(String(id));
    setOrder(res);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const nextStatus = (): OrderStatus | undefined => {
    if (!order) return undefined;
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return order.status;
    return STATUS_FLOW[idx + 1];
  };

  const onAdvance = async () => {
    if (!order) return;
    const ns = nextStatus();
    if (!ns || ns === order.status) return;
    setLoading(true);
    const updated = await updateOrderStatus(order.id, ns, note);
    setOrder(updated);
    setLoading(false);
  };

  const onCancel = async () => {
    if (!order) return;
    setLoading(true);
    const updated = await updateOrderStatus(order.id, 'cancelled', note);
    setOrder(updated);
    setLoading(false);
  };

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">{t('loading', { defaultValue: 'Loading...' })}</Text>
      </View>
    );
  }

  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <View className="flex-1 p-4 gap-3 bg-white dark:bg-black">
      <Text className="text-xl font-bold text-black dark:text-white">{t('orderDetail.title')} {order.code}</Text>
      <Text className="text-sm text-gray-700 dark:text-gray-200">{t('orderDetail.customer')}: {order.customerName}</Text>
      <Text className="text-sm text-gray-700 dark:text-gray-200">{t('orderDetail.status')}: {order.status}</Text>

      <FlatList
        data={order.items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-black dark:text-white">{item.name}</Text>
              <Text className="text-brand font-semibold">Rp {(item.price * item.qty).toLocaleString()}</Text>
            </View>
            <Text className="text-xs text-gray-600 dark:text-gray-300">Qty: {item.qty} • Price: Rp {item.price.toLocaleString()}</Text>
          </View>
        )}
      />

      <View className="flex-row justify-between">
        <Text className="text-black dark:text-white font-semibold">{t('orderDetail.subtotal')}</Text>
        <Text className="text-brand font-semibold">Rp {subtotal.toLocaleString()}</Text>
      </View>

      <View className="gap-2">
          <Text className="text-black dark:text-white">{t('orderDetail.notes')}</Text>
        <TextInput
          placeholder={t('orderDetail.optionalNotes')}
          value={note}
          onChangeText={setNote}
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white"
          placeholderTextColor="#888"
        />
      </View>

      <View className="flex-row gap-2">
        <Pressable disabled={loading || order.status === 'completed' || order.status === 'cancelled'} onPress={onAdvance} className={`px-3 py-2 rounded-lg ${order.status === 'completed' || order.status === 'cancelled' ? 'bg-gray-300 dark:bg-gray-700' : 'bg-brand'}`}>
          <Text className="text-white font-semibold">{t('orderDetail.advance')}</Text>
        </Pressable>
        <Pressable disabled={loading || order.status === 'completed' || order.status === 'cancelled'} onPress={onCancel} className={`px-3 py-2 rounded-lg ${order.status === 'completed' || order.status === 'cancelled' ? 'bg-gray-300 dark:bg-gray-700' : 'border border-red-500'}`}>
          <Text className="text-red-600 font-semibold">{t('orderDetail.cancel')}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700">
          <Text className="text-black dark:text-white">{t('orderDetail.back')}</Text>
        </Pressable>
      </View>
    </View>
  );
}
