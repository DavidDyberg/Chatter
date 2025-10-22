import { getUser } from '@/api-routes/user'
import { useQuery } from '@tanstack/react-query'

import { createFileRoute, useParams } from '@tanstack/react-router'

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

  return <div>{data?.bio}</div>
}
