'use client';

import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/lib/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  /* 自动滚动到当前高亮的目录项 */
  useEffect(() => {
    if (!activeId || !navRef.current) return;
    const link = navRef.current.querySelector(`a[href="#${activeId}"]`);
    if (link) {
      link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <nav ref={navRef} aria-label="文章目录">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        目录
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`block rounded px-3 py-1.5 text-xs leading-relaxed transition-colors ${item.level === 3 ? 'ml-4' : ''} ${
                activeId === item.id
                  ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
