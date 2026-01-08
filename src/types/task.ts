export type WorkerRole = 'designer' | 'carver' | 'caster' | 'diamondsetter' | 'finisher';
export type TaskStatus = 'assigned' | 'in-progress' | 'checked' | 'verified' | 'done';

export interface Task {
  id: string;
  title: string;
  orderCode: string;
  role: WorkerRole;
  status: TaskStatus;
  updatedAt: string;
}

export type TaskSortBy = 'updatedAt' | 'orderCode' | 'title';
export type TaskSortDir = 'asc' | 'desc';

export interface TaskQuery {
  page: number;
  pageSize: number;
  search?: string; // title or orderCode
  role?: WorkerRole | 'all';
  status?: TaskStatus | 'all';
  sortBy?: TaskSortBy;
  sortDir?: TaskSortDir;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  pages: number;
}
