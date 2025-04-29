import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_manage')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello &quot;/manage&quot;!</div>;
}
