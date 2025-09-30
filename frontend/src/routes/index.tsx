import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="pt-8">
      <p className="font-poppins">Homepage</p>
    </div>
  )
}
