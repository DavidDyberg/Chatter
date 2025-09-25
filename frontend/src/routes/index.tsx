import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <p className="text-white font-poppins">Homepage</p>
    </div>
  )
}
