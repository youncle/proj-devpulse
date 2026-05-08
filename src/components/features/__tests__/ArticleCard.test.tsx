import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

// Mock next/link 为普通 a 标签（next/link 是默认导出 ESM 模块）
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const defaultProps = {
  title: 'Understanding React Server Components',
  excerpt: 'Server Components allow you to render components on the server...',
  date: '2024-03-15',
  tags: ['React', 'Next.js'],
  slug: 'understanding-react-server-components',
  readingTime: '5 分钟',
};

describe('ArticleCard', () => {
  // 正常渲染：传入完整的文章数据
  it('should render title, excerpt, date and tags', () => {
    render(<ArticleCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.excerpt)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  // 链接跳转：slug 正确拼接到 /blog/{slug}
  it('should render article link with correct href', () => {
    render(<ArticleCard {...defaultProps} />);

    const link = screen.getByRole('link', { name: defaultProps.title });
    expect(link).toHaveAttribute('href', `/blog/${defaultProps.slug}`);
  });

  // 日期属性：time 元素有正确的 dateTime
  it('should set correct dateTime on time element', () => {
    render(<ArticleCard {...defaultProps} />);

    const time = screen.getByText(defaultProps.date).closest('time');
    expect(time).toHaveAttribute('dateTime', defaultProps.date);
  });

  // 标签渲染：传入单个标签时正常显示
  it('should render a single tag', () => {
    render(<ArticleCard {...defaultProps} tags={['React']} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Next.js')).not.toBeInTheDocument();
  });

  // 边界情况：标签数组为空时，不渲染任何标签
  it('should not render any tag when tags array is empty', () => {
    const { container } = render(<ArticleCard {...defaultProps} tags={[]} />);

    // 检查标签容器内没有 span 元素
    const tagContainer = container.querySelector('.flex-wrap');
    expect(tagContainer?.children.length).toBe(0);
  });

  // 边界情况：超长标题和摘要
  it('should render long title and excerpt without truncation', () => {
    const longTitle = 'A'.repeat(200);
    const longExcerpt = 'B'.repeat(500);

    render(
      <ArticleCard
        {...defaultProps}
        title={longTitle}
        excerpt={longExcerpt}
      />,
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longExcerpt)).toBeInTheDocument();
  });

  // 边界情况：日期为空字符串
  it('should handle empty date gracefully', () => {
    const { container } = render(<ArticleCard {...defaultProps} date="" />);

    expect(container.querySelector('time[dateTime=""]')).not.toBeNull();
  });
});
