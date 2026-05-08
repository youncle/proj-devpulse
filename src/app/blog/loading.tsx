export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12">
        <div className="mb-2 h-9 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-900" />
      </header>
      <div className="space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 pb-10 dark:border-gray-800">
            <div className="mb-3 flex gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-900" />
            </div>
            <div className="mb-2 h-7 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-900" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-md bg-gray-100 dark:bg-gray-900" />
              <div className="h-6 w-20 animate-pulse rounded-md bg-gray-100 dark:bg-gray-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
