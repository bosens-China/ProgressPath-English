import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_manage/course')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_manage/course"!</div>
}
