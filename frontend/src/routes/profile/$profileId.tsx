import { getUser } from '@/api-routes/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { BadgeCheck, ChevronsDown } from 'lucide-react'
import { ButtonComponent } from '@/components/Button'
import { formatDate } from '@/utils/formatDate'
import { PostComponent } from '@/components/PostComponent'
import { ProfileSkeleton } from '@/components/skeleton/ProfileSkeleton'
import { PostSkeleton } from '@/components/skeleton/PostSkeleton'
import { useState } from 'react'
import { EditProfile } from '@/components/EditProfile'
import { useAuth0Context } from '@/auth/auth0'
import { deletePost } from '@/api-routes/posts'
import toast from 'react-hot-toast'

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
  const [isEditMode, setIsEditMode] = useState(false)
  const params = useParams({ from: '/profile/$profileId' })
  const { isUserMe } = useAuth0Context()

  const {
    data: userData,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['user', params.profileId],
    queryFn: () => getUser(params.profileId),
  })

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: (id: string) => deletePost(id),

    onSuccess: () => {
      toast.success('Post deleted successfully')
      refetch()
    },

    onError: () => {
      toast.error('Something went wrong when deleting post, try again later')
    },
  })

  const isOwner = isUserMe(params.profileId)
  return (
    <section className="relative">
      {isPending ? (
        <ProfileSkeleton />
      ) : (
        <>
          {isEditMode ? (
            <EditProfile
              id={params.profileId}
              userName={userData?.userName || ''}
              bio={userData?.bio || ''}
              profileBanner={userData?.profileBanner || '/default-banner.svg'}
              profileImage={userData?.profileImage || '/blank-profile.webp'}
              onClose={() => setIsEditMode(false)}
              onSave={() => {
                refetch()
                setIsEditMode(false)
              }}
            />
          ) : (
            <>
              <div className="relative">
                <img
                  className="md:h-[200px] h-[140px] w-full object-cover"
                  src={userData?.profileBanner || '/default-banner.svg'}
                  alt="Profile banner"
                />

                <img
                  className="absolute left-5 md:-bottom-[60px] -bottom-[50px] md:w-[120px] md:h-[120px] w-[100px] h-[100px] rounded-full object-cover"
                  src={userData?.profileImage || '/blank-profile.webp'}
                  alt="Profile"
                />
              </div>
              <div className="pb-[70px]" />

              <div className="px-5 flex flex-col gap-4">
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
                  {isOwner && (
                    <ButtonComponent
                      className="p-2 pl-4 pr-4"
                      label="Edit profile"
                      variant="Seacondary"
                      onClick={() => setIsEditMode(true)}
                    />
                  )}
                </div>
                <p>{userData?.bio}</p>
              </div>
            </>
          )}
        </>
      )}

      <div className="flex flex-col items-center gap-2">
        <p className="pt-5 text-xl">
          {isOwner ? 'Your posts' : `${userData?.userName}'s posts`}
        </p>

        <ChevronsDown size={34} />
      </div>

      {userData?.posts.length === 0 && (
        <p className="text-center pt-5">
          {isOwner
            ? 'You currently have no posts.'
            : `${userData.userName} currently has no posts.`}
        </p>
      )}

      {isPending ? (
        <PostSkeleton className="px-5" />
      ) : (
        <div className="px-5 pt-5">
          {userData?.posts.map((post) => (
            <PostComponent
              key={post.id}
              authorId={post.user_id}
              content={post.content}
              authorName={userData.userName}
              authorImage={userData.profileImage || '/blank-profile.webp'}
              postImage={post.image}
              likesAmmount={post._count.likes}
              commentsAmmount={post._count.comments}
              created_at={formatDate(post.createdAt)}
              isAdmin={userData.role === 'ADMIN'}
              onDelete={() => mutate(post.id)}
              isDeleting={isDeletePending}
            />
          ))}
        </div>
      )}
    </section>
  )
}
