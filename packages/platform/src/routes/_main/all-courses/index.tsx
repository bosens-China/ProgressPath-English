import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/all-courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/all-courses/"!</div>
}
