import { InventoryItem, InventoryQuery, PagedResult } from '@/types/inventory';

const categories = ['ring', 'necklace', 'bracelet', 'earring', 'pendant'] as const;
const metals = ['gold', 'silver', 'platinum'] as const;

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMock(length = 60): InventoryItem[] {
  const items: InventoryItem[] = [];
  for (let i = 1; i <= length; i++) {
    const cat = categories[i % categories.length];
    const metal = metals[i % metals.length];
    const r = seededRandom(i);
    items.push({
      id: String(i),
      sku: `SKU-${i.toString().padStart(4, '0')}`,
      name: `${metal.toUpperCase()} ${cat} ${i}`,
      category: cat,
      metal: metal,
      weightGram: Math.round((r * 10 + 1) * 100) / 100,
      price: Math.round((r * 500 + 100) * 1000),
      stock: Math.floor(r * 20),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString()
    });
  }
  return items;
}

const DATA = generateMock(75);

export async function fetchInventory(q: InventoryQuery): Promise<PagedResult<InventoryItem>> {
  const { page, pageSize, search, category, metal, sortBy = 'updatedAt', sortDir = 'desc' } = q;
  let filtered = [...DATA];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((it) => it.name.toLowerCase().includes(s) || it.sku.toLowerCase().includes(s));
  }
  if (category && category !== 'all') {
    filtered = filtered.filter((it) => it.category === category);
  }
  if (metal && metal !== 'all') {
    filtered = filtered.filter((it) => it.metal === metal);
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
