import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UsersService } from 'backend-services/users/users.service.ts';

export type User = null | Awaited<ReturnType<UsersService['loginWithPhone']>>;

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
