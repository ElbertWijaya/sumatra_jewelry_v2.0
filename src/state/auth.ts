import { create } from 'zustand';

export type Role =
  | 'sales'
  | 'designer'
  | 'carver'
  | 'caster'
  | 'diamondsetter'
  | 'finisher'
  | 'inventory';

interface AuthState {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  login: (role) => set({ role }),
  logout: () => set({ role: null })
}));
