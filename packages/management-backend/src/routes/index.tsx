import { createFileRoute, redirect } from '@tanstack/react-router';
import { useUserStore } from '@/stores/user';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader() {
    const token = useUserStore.getState().user?.access_token;
    if (!token) {
      return redirect({
        to: '/login',
        throw: true,
      });
    }
    redirect({
      to: '/courses',
      throw: true,
    });
  },
});

function RouteComponent() {
  return null;
}
