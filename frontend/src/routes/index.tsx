import { createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { getAccessTokenSilently } = useAuth0()
  useEffect(() => {
    async function hej() {
      const token = await getAccessTokenSilently()
      const response = await fetch(
        'https://chatter-r8i2.onrender.com/api/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log(response.status)
    }
    hej()
  }, [])

  const { user } = useAuth0()
  return (
    <div className="pt-8">
      <p className="font-poppins">Homepage</p>
      {user?.name}
    </div>
  )
}
