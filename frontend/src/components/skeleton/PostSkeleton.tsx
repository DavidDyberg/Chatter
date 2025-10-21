export const PostSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 pt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="flex gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>

          <div className="flex items-start flex-col flex-1">
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>

                <div className="w-5 h-5 bg-transparent"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mt-1"></div>
            </div>

            <div className="flex flex-col pt-2 gap-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>

              {Math.random() > 0.5 && (
                <div className="h-84 bg-gray-200 rounded-xl animate-pulse"></div>
              )}

              <div className="flex gap-3 pt-2">
                <div className="flex gap-1 items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
