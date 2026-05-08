import { articles } from '@/data/articles';
import { readingTime } from '@/lib/reading-time';
import { ArticleCard } from '@/components/features/ArticleCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章 - DevPulse',
  description: 'DevPulse 技术博客文章列表',
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-1 py-6">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          所有文章
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          共 {articles.length} 篇
        </p>
      </header>

      <section className="rounded-xl bg-white p-6 dark:bg-gray-900">
        {articles.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500">暂无文章</p>
        ) : (
          <div className="space-y-10">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                tags={article.tags}
                slug={article.slug}
                readingTime={readingTime(article.content)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
