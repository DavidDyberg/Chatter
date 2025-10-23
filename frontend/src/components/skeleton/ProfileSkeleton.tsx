export const ProfileSkeleton = () => {
  return (
    <section className="relative">
      <div className="relative">
        <div className="max-h-[200px] h-[200px] w-full bg-gray-200 animate-pulse" />
        <div className="absolute left-5 md:-bottom-[60px] -bottom-[50px]">
          <div className="md:w-[120px] w-[100px] h-[100px] md:h-[120px] rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="pb-[70px]" />
      <div className="px-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </section>
  )
}
