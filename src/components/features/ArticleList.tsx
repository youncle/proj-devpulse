import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types/article';
import { readingTime } from '@/lib/reading-time';

export interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <section className="rounded-xl bg-white p-6 dark:bg-gray-900">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        最新文章
      </h1>
      <div className="space-y-8">
        {articles.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500">暂无文章</p>
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              date={article.date}
              tags={article.tags}
              slug={article.slug}
              readingTime={readingTime(article.content)}
            />
          ))
        )}
      </div>
    </section>
  );
}
