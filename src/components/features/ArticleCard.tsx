import Link from 'next/link';
import { ClockIcon } from '@/components/ui/Icons';

export interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  slug: string;
  readingTime: string;
}

export function ArticleCard({ title, excerpt, date, tags, slug, readingTime: readingTimeText }: ArticleCardProps) {
  return (
    <article className="group border-b border-gray-100 pb-8 last:border-0 dark:border-gray-800">
      <div className="mb-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <time dateTime={date}>{date}</time>
        <span className="inline-flex items-center gap-1">
          <ClockIcon />
          {readingTimeText}
        </span>
      </div>
      <h2 className="mb-2 text-xl font-semibold leading-snug">
        <Link
          href={`/blog/${slug}`}
          className="text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
        >
          {title}
        </Link>
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {excerpt}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 transition-colors dark:bg-blue-950 dark:text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
