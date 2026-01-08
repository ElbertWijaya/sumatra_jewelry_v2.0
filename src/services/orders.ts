import type { Order, OrderItem, OrderQuery, PagedResult } from '@/types/order';

const statuses = ['draft','ongoing','completed','cancelled'] as const;

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function genItems(n: number): OrderItem[] {
  const arr: OrderItem[] = [];
  for (let i = 1; i <= n; i++) {
    const r = seededRandom(i * 7);
    const price = Math.round((r * 500 + 50) * 1000);
    const qty = Math.max(1, Math.floor(r * 3));
    arr.push({ id: String(i), name: `Item ${i}`, price, qty });
  }
  return arr;
}

function calcTotal(items: OrderItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function generateMock(length = 60): Order[] {
  const items = genItems(5);
  const orders: Order[] = [];
  for (let i = 1; i <= length; i++) {
    const r = seededRandom(i * 13);
    const status = statuses[i % statuses.length];
    const code = `ORD-${i.toString().padStart(4, '0')}`;
    const customer = `Customer ${Math.floor(r * 50) + 1}`;
    const its = items.map((it) => ({ ...it, id: `${it.id}-${i}` }));
    const total = calcTotal(its);
    orders.push({
      id: String(i),
      code,
      customerName: customer,
      items: its,
      total,
      status,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 43200000).toISOString()
    });
  }
  return orders;
}

const DATA: Order[] = generateMock(75);

export async function fetchOrders(q: OrderQuery): Promise<PagedResult<Order>> {
  const { page, pageSize, search, status, sortBy = 'updatedAt', sortDir = 'desc' } = q;
  let filtered = [...DATA];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((o) => o.code.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s));
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((o) => o.status === status);
  }
  filtered.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  await new Promise((r) => setTimeout(r, 200));
  return { items, total, pages };
}

export async function createOrder(payload: { customerName: string; items: OrderItem[] }): Promise<Order> {
  const id = String(DATA.length + 1);
  const code = `ORD-${id.padStart(4, '0')}`;
  const order: Order = {
    id,
    code,
    customerName: payload.customerName,
    items: payload.items,
    total: calcTotal(payload.items),
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  DATA.unshift(order);
  await new Promise((r) => setTimeout(r, 200));
  return order;
}
