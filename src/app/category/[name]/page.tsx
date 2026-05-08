import { articles } from '@/data/articles';
import { readingTime } from '@/lib/reading-time';
import { ArticleCard } from '@/components/features/ArticleCard';
import { CATEGORIES } from '@/data/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export interface CategoryPageProps {
  params: { name: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((name) => ({ name }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const name = decodeURIComponent(params.name);
  return {
    title: `${name} - DevPulse`,
    description: `${name} 分类下的文章`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.name);

  if (!CATEGORIES.includes(categoryName as typeof CATEGORIES[number])) {
    notFound();
  }

  const filteredArticles = articles.filter(
    (article) => article.category === categoryName
  );

  return (
    <div className="mx-auto max-w-5xl px-2 py-6">
      <header className="mb-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          &larr; 返回首页
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {categoryName}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          共 {filteredArticles.length} 篇
        </p>
      </header>

      <section className="rounded-xl bg-white p-6 dark:bg-gray-900">
        {filteredArticles.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500">暂无文章</p>
        ) : (
          <div className="space-y-10">
            {filteredArticles.map((article) => (
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
