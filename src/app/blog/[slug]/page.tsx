import Link from 'next/link';
import { articles } from '@/data/articles';
import { readingTime } from '@/lib/reading-time';
import { parseToc } from '@/lib/toc';
import { TableOfContents } from '@/components/features/TableOfContents';
import { ArrowLeftIcon, ClockIcon } from '@/components/ui/Icons';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';

export interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return { title: `${article.title} - DevPulse`, description: article.excerpt };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  const { items: tocItems, html: contentHtml } = parseToc(article.content);
  const sanitizedHtml = sanitizeHtml(contentHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'pre', 'code', 'span', 'blockquote',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['id', 'class', 'style'],
      'img': ['src', 'alt', 'width', 'height'],
      'a': ['href', 'target', 'rel'],
    },
  });

  const currentIndex = articles.findIndex((a) => a.slug === params.slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-6xl px-1 py-6">
      <div className="lg:grid lg:grid-cols-[12rem_1fr] lg:gap-6">
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <div className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
            <TableOfContents items={tocItems} />
          </div>
        </aside>

        <article className="min-w-0 rounded-xl bg-white p-6 dark:bg-gray-900">
          <header className="mb-10">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon />
              返回文章列表
            </Link>

            <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={article.date}>{article.date}</time>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {readingTime(article.content)}
              </span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {sanitizedHtml ? (
          <div
            className="prose prose-gray max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
          ) : (
            <p className="text-gray-400 dark:text-gray-500">内容渲染失败</p>
          )}

          <hr className="my-12 border-gray-200 dark:border-gray-800" />

          <nav className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {prevArticle && (
                <Link
                  href={`/blog/${prevArticle.slug}`}
                  className="group block"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">上一篇</span>
                  <span className="mt-1 block text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {prevArticle.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {nextArticle && (
                <Link
                  href={`/blog/${nextArticle.slug}`}
                  className="group block"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">下一篇</span>
                  <span className="mt-1 block text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}
