import { ArticleList } from '@/components/features/ArticleList';
import { Sidebar } from '@/components/ui/Sidebar';
import { articles } from '@/data/articles';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-1 py-6">
      <div className="grid gap-6 lg:grid-cols-[20%_1fr]">
        <Sidebar />
        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
