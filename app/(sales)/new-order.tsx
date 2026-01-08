import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrder } from '@/services/orders';

const itemSchema = z.object({ name: z.string().min(1), price: z.number().min(0), qty: z.number().int().min(1) });
const schema = z.object({ customerName: z.string().min(1), items: z.array(itemSchema).min(1) });

type FormData = z.infer<typeof schema>;

export default function SalesNewOrder() {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: '', items: [] }
  });

  const [tempItem, setTempItem] = useState({ name: '', price: '', qty: '' });
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => {
    const name = tempItem.name.trim();
    const price = Number(tempItem.price);
    const qty = Number(tempItem.qty);
    if (!name || isNaN(price) || isNaN(qty) || qty < 1) return;
    // @ts-expect-error register types
    const current = (register('items').value ?? []) as any[];
    const next = [...current, { name, price, qty }];
    setValue('items', next, { shouldValidate: true });
    setTempItem({ name: '', price: '', qty: '' });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await createOrder({ customerName: data.customerName, items: data.items.map((it, idx) => ({ id: String(idx+1), ...it })) });
      setValue('customerName', '');
      setValue('items', []);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 p-4 gap-3 bg-white dark:bg-black">
      <Text className="text-xl font-bold text-black dark:text-white">New Order</Text>
      <TextInput
        placeholder="Customer Name"
        onChangeText={(v) => setValue('customerName', v, { shouldValidate: true })}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white"
        placeholderTextColor="#888"
      />
      {errors.customerName && <Text className="text-red-600">Customer name required</Text>}

      <View className="gap-2">
        <Text className="text-black dark:text-white font-semibold">Add Item</Text>
        <View className="flex-row gap-2">
          <TextInput placeholder="Name" value={tempItem.name} onChangeText={(v) => setTempItem((s) => ({ ...s, name: v }))} className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white" />
          <TextInput placeholder="Price" keyboardType="numeric" value={tempItem.price} onChangeText={(v) => setTempItem((s) => ({ ...s, price: v }))} className="w-24 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white" />
          <TextInput placeholder="Qty" keyboardType="numeric" value={tempItem.qty} onChangeText={(v) => setTempItem((s) => ({ ...s, qty: v }))} className="w-20 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-black dark:text-white" />
          <Pressable onPress={addItem} className="px-3 py-2 rounded-lg bg-brand"><Text className="text-white">Add</Text></Pressable>
        </View>
      </View>
      {errors.items && <Text className="text-red-600">At least one item</Text>}

      {/* Items preview */}
      {/* @ts-expect-error read items value */}
      <FlatList data={(register('items').value ?? []) as any[]} keyExtractor={(_, idx) => String(idx)} contentContainerStyle={{ gap: 8 }} renderItem={({ item }) => (
        <View className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-black dark:text-white">{item.name}</Text>
            <Text className="text-brand font-semibold">Rp {Number(item.price).toLocaleString()}</Text>
          </View>
          <Text className="text-xs text-gray-600 dark:text-gray-300">Qty: {item.qty}</Text>
        </View>
      )} />

      <Pressable disabled={submitting} onPress={handleSubmit(onSubmit)} className={`px-3 py-3 rounded-lg ${submitting ? 'bg-gray-300 dark:bg-gray-700' : 'bg-brand'}`}>
        <Text className="text-white font-semibold">Submit</Text>
      </Pressable>
    </View>
  );
}
