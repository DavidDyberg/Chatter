import { searchUsers } from '@/api-routes/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/explore')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchTerm])

  const { data, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: () => searchUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  })

  return (
    <div className="flex flex-col items-center gap-6 pt-12 px-4">
      <h1 className="text-2xl font-semibold text-purple-dark text-center">
        Explore Users
      </h1>
      <p className=" text-center max-w-md">
        Search for a user to view their profile.
      </p>
      <input
        className="md:w-xl w-full rounded-lg p-3 border border-purple-light focus:outline-none focus:ring-2 focus:ring-purple-dark transition"
        placeholder="🔍 Type a username..."
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="md:max-w-xl w-full flex flex-col gap-3 mt-4">
        {isFetching && (
          <p className="text-gray-500 text-center animate-pulse">
            Searching users...
          </p>
        )}

        {data && data.length > 0
          ? data.map((user) => (
              <Link
                key={user.id}
                params={{ profileId: user.id }}
                to="/profile/$profileId"
              >
                <div className="p-3 flex gap-2 border rounded-lg border-purple-light hover:opacity-85 cursor-pointer">
                  <img
                    className="w-12 h-12 rounded-full object-cover"
                    src={user.profileImage || '/blank-profile.webp'}
                    alt={`${user.userName}'s profile image`}
                  />
                  <div>
                    <p className="font-medium">{user.userName}</p>
                  </div>
                </div>
              </Link>
            ))
          : debouncedSearch &&
            !isFetching && (
              <p className="text-gray-500 text-center">No users found</p>
            )}
      </div>
    </div>
  )
}
