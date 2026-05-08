import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav aria-label="主导航" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-2">
        <Link href="/" className="text-xl font-bold tracking-tight">
          DevPulse
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            首页
          </Link>
          <Link href="/blog" className="hover:text-gray-900 dark:hover:text-gray-100">
            文章
          </Link>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-100">
            关于
          </Link>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
