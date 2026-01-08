export type ItemCategory = 'ring' | 'necklace' | 'bracelet' | 'earring' | 'pendant';
export type MetalType = 'gold' | 'silver' | 'platinum';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ItemCategory;
  metal: MetalType;
  weightGram: number;
  price: number;
  stock: number;
  updatedAt: string; // ISO
}

export type SortBy = 'name' | 'price' | 'updatedAt' | 'stock';
export type SortDir = 'asc' | 'desc';

export interface InventoryQuery {
  page: number;
  pageSize: number; // always 10 in prototype
  search?: string;
  category?: ItemCategory | 'all';
  metal?: MetalType | 'all';
  sortBy?: SortBy;
  sortDir?: SortDir;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  pages: number;
}
