import { createFileRoute } from '@tanstack/react-router'
import { WrenchIcon } from 'lucide-react'

export const Route = createFileRoute('/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-dark mb-4">
        <WrenchIcon size={32} />
      </div>
      <h1 className="text-2xl font-semibold text-purple-dark mb-2">
        Messages Page Under Construction
      </h1>
      <p className="text-gray-500 max-w-md">
        We’re currently working on this page. Soon you’ll be able to chat and
        connect with other users here!
      </p>
    </div>
  )
}
