export default function PublicLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero section skeleton */}
      <div className="h-[400px] bg-primary-100" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Section title */}
        <div className="mb-8 flex justify-center">
          <div className="h-8 w-64 rounded bg-gray-200" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-primary-50" />
              {/* Text placeholders */}
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
