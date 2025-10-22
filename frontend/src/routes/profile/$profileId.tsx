import { getUser } from '@/api-routes/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import defaultBanner from '../../../public/default-banner.svg'
import { BadgeCheck } from 'lucide-react'
import { ButtonComponent } from '@/components/Button'
import { formatDate } from '@/utils/formatDate'

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

  console.log('PARAMS', params)

  const { data } = useQuery({
    queryKey: ['user', params.profileId],
    queryFn: () => getUser(params.profileId),
  })

  console.log(data)

  return (
    <section className="relative">
      <div className="relative">
        <img
          className="max-h-[200px] w-full object-cover"
          src={data?.profileBanner || defaultBanner}
          alt="Profile banner"
        />

        <img
          className="absolute left-5 md:-bottom-[60px] -bottom-[50px] md:w-[120px] w-[100px] rounded-full object-cover"
          src={data?.profileImage}
          alt="Profile"
        />
      </div>
      <div className="pb-[70px]" />

      <div className="pl-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-xl">{data?.userName}</p>
              {data?.role === 'ADMIN' && (
                <BadgeCheck className="ml-1" color="#6B5FF3" />
              )}
            </div>
            <p className="text-purple-light text-sm">
              Joined {formatDate(data?.createdAt)}
            </p>
          </div>

          <ButtonComponent
            className="p-2 pl-4 pr-4"
            label="Edit profile"
            variant="Seacondary"
          />
        </div>
        <p>{data?.bio}</p>
      </div>
    </section>
  )
}
