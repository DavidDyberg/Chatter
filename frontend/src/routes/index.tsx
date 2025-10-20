import { createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { PostComponent } from '@/components/PostComponent'
import { ButtonComponen } from '@/components/Button'

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
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Welcome {user?.name}</p>
        <ButtonComponen variant="Primary" label="Post" />
      </div>

      <PostComponent
        className="pt-4"
        likesAmmount={134}
        commentsAmmount={5}
        created_at="12 Jan 2026"
        content="lorem ipsum asmd as sa ölm as. D asd asd öklmas dasd lkm. dsaasdölasdaslm"
        authorName="David Dyberg"
        authorImage="https://media.gettyimages.com/id/1437816897/sv/foto/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring-or.jpg?s=612x612&w=gi&k=20&c=K-c6v1VurCjpfN4HEY2H28mYVNyhBF_tGh6T1x6ElZ4="
        postImage="https://upload.wikimedia.org/wikipedia/commons/4/4d/Djurgarden.jpg"
        isAdmin
      />
    </div>
  )
}
