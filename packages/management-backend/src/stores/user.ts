import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AdminService } from 'backend-services/admin/admin.service.ts';

export type User = null | Awaited<ReturnType<AdminService['login']>>;

interface UserState {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set(() => ({ user })),
      }),
      { name: 'user-store' },
    ),
  ),
);
