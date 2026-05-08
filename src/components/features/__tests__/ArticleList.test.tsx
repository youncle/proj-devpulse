import { render, screen } from '@testing-library/react';
import { ArticleList } from '../ArticleList';
import type { Article } from '@/types/article';

const mockArticles: Article[] = [
  {
    title: 'Article One',
    excerpt: 'First article',
    date: '2026-01-01',
    category: '人工智能',
    tags: ['React'],
    slug: 'article-one',
    content: '<p>Content one</p>',
  },
  {
    title: 'Article Two',
    excerpt: 'Second article',
    date: '2026-01-02',
    category: '人工智能',
    tags: ['Next.js', 'TypeScript'],
    slug: 'article-two',
    content: '<p>Content two ' + 'long '.repeat(50) + '</p>',
  },
];

describe('ArticleList', () => {
  it('should render article titles', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('Article One')).toBeInTheDocument();
    expect(screen.getByText('Article Two')).toBeInTheDocument();
  });

  it('should render section heading', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('最新文章')).toBeInTheDocument();
  });

  it('should render empty state when no articles', () => {
    render(<ArticleList articles={[]} />);
    expect(screen.getByText('暂无文章')).toBeInTheDocument();
  });

  it('should render tags for each article', () => {
    render(<ArticleList articles={mockArticles} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render reading time for each article', () => {
    render(<ArticleList articles={mockArticles} />);
    const times = screen.getAllByText(/分钟/);
    expect(times).toHaveLength(2);
  });
});
