import { createRootRoute } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
// import { useUserStore } from '@/stores/user';

export const Route = createRootRoute({
  component: RootComponent,
  // beforeLoad: async ({ location }) => {
  //   const isAuthenticated = !!useUserStore.getState().user?.access_token;
  //   if (!isAuthenticated) {
  //     return {
  //       redirect: {
  //         to: '/login',
  //         search: {
  //           redirect: location.href,
  //         },
  //       },
  //     };
  //   }
  //   return {};
  // },
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
