import { getUser } from '@/api-routes/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { BadgeCheck, ChevronsDown } from 'lucide-react'
import { ButtonComponent } from '@/components/Button'
import { formatDate } from '@/utils/formatDate'
import { PostComponent } from '@/components/PostComponent'

export const Route = createFileRoute('/profile/$profileId')({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery({
      queryKey: ['user', params.profileId],
      queryFn: () => getUser(params.profileId),
    })
  },
})

function RouteComponent() {
  const params = useParams({ from: '/profile/$profileId' })

  const { data: userData } = useQuery({
    queryKey: ['user', params.profileId],
    queryFn: () => getUser(params.profileId),
  })

  return (
    <section className="relative">
      <div className="relative">
        <img
          className="max-h-[200px] w-full object-cover"
          src={userData?.profileBanner || '/default-banner.svg'}
          alt="Profile banner"
        />

        <img
          className="absolute left-5 md:-bottom-[60px] -bottom-[50px] md:w-[120px] w-[100px] rounded-full object-cover"
          src={userData?.profileImage}
          alt="Profile"
        />
      </div>
      <div className="pb-[70px]" />

      <div className="pl-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-xl">{userData?.userName}</p>
              {userData?.role === 'ADMIN' && (
                <BadgeCheck className="ml-1" color="#6B5FF3" />
              )}
            </div>
            <p className="text-purple-light text-sm">
              Joined {formatDate(userData?.createdAt)}
            </p>
          </div>

          <ButtonComponent
            className="p-2 pl-4 pr-4"
            label="Edit profile"
            variant="Seacondary"
          />
        </div>
        <p>{userData?.bio}</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="pt-5 text-3xl">Your posts</p>
        <ChevronsDown size={34} />
      </div>

      {!userData?.posts && (
        <p className="text-center pt-5">You currently have no posts.</p>
      )}
      <div className="pl-5 pt-5">
        {userData?.posts.map((post) => (
          <PostComponent
            key={post.id}
            content={post.content}
            authorName={userData.userName}
            authorImage={userData.profileImage}
            postImage={post.image}
            likesAmmount={post._count.likes}
            commentsAmmount={post._count.comments}
            created_at={formatDate(post.createdAt)}
            isAdmin={userData.role === 'ADMIN'}
          />
        ))}
      </div>
    </section>
  )
}
