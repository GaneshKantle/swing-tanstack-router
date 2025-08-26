import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/notifications/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/notifications/create"!</div>
}
