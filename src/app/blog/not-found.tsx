import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-200 dark:text-gray-800">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        文章不存在
      </h2>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        你要找的文章可能已被移除或链接有误
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        返回文章列表
      </Link>
    </div>
  );
}
