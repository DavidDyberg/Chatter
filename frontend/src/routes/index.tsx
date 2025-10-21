import { createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { PostComponent } from '@/components/PostComponent'
import { ButtonComponent } from '@/components/Button'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchPosts } from '@/api-routes/posts'

export const Route = createFileRoute('/')({
  component: App,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
      }),
    ])
  },
})

function App() {
  const { getAccessTokenSilently } = useAuth0()

  const postsQuery = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

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
    <div className="pt-8 pl-4 pr-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold">Welcome {user?.name}</p>
        <ButtonComponent variant="Primary" label="Post" />
      </div>

      <div className="flex flex-col gap-4 pt-4">
        {postsQuery.data.map((post) => (
          <PostComponent
            key={post.id}
            className="pt-4"
            likesAmmount={post._count.likes}
            commentsAmmount={post._count.comments}
            created_at={post.createdAt}
            content={post.content}
            authorName={post.user.userName}
            authorImage={post.user.profileImage}
            postImage={post.image}
            isAdmin={post.user.role === 'ADMIN'}
          />
        ))}
      </div>
    </div>
  )
}
