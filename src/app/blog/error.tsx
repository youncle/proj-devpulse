'use client';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
        出错了
      </h1>
      <p className="mb-2 text-gray-500 dark:text-gray-400">
        文章加载失败，请稍后重试
      </p>
      <p className="mb-8 text-sm text-gray-400 dark:text-gray-500">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        重试
      </button>
    </div>
  );
}
