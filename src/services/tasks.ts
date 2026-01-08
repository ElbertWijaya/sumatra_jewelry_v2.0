import type { Task, TaskQuery, PagedResult, WorkerRole, TaskStatus } from '@/types/task';

const roles: WorkerRole[] = ['designer','carver','caster','diamondsetter','finisher'];
const statuses: TaskStatus[] = ['assigned','in-progress','checked','verified','done'];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMock(length = 80): Task[] {
  const items: Task[] = [];
  for (let i = 1; i <= length; i++) {
    const r = seededRandom(i * 17);
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];
    items.push({
      id: String(i),
      title: `Work on piece ${Math.floor(r * 100)}`,
      orderCode: `ORD-${(Math.floor(r * 75) + 1).toString().padStart(4, '0')}`,
      role,
      status,
      updatedAt: new Date(Date.now() - i * 3600000).toISOString()
    });
  }
  return items;
}

const DATA = generateMock(120);

export async function fetchTasks(q: TaskQuery): Promise<PagedResult<Task>> {
  const { page, pageSize, search, role, status, sortBy = 'updatedAt', sortDir = 'desc' } = q;
  let filtered = [...DATA];
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(s) || t.orderCode.toLowerCase().includes(s));
  }
  if (role && role !== 'all') {
    filtered = filtered.filter((t) => t.role === role);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter((t) => t.status === status);
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
