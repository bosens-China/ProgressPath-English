import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/my-courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/my-courses/"!</div>
}
