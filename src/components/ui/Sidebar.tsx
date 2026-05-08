import { CATEGORIES, HOT_TAGS } from '@/data/constants';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto space-y-8 rounded-xl bg-white p-6 dark:bg-gray-900">
      {/* 关于 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          关于
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          DevPulse 是一个面向开发者的技术博客，分享前端、后端、AI 等领域的技术实践与思考。
        </p>
      </section>

      {/* 分类 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          分类
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={`/category/${encodeURIComponent(category)}`}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 标签 */}
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          热门标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {HOT_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
}
