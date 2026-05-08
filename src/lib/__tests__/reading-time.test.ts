import { readingTime } from '../reading-time';

describe('readingTime', () => {
  it('should return 1 minute for short content', () => {
    const result = readingTime('<p>Hello world</p>');
    expect(result).toBe('1 分钟');
  });

  it('should estimate time for Chinese content', () => {
    const chineseText = '<p>' + '技术'.repeat(300) + '</p>';
    expect(readingTime(chineseText)).toBe('2 分钟');
  });

  it('should estimate time for English content', () => {
    const englishText = '<p>' + 'word '.repeat(400) + '</p>';
    expect(readingTime(englishText)).toBe('2 分钟');
  });

  it('should handle mixed Chinese and English', () => {
    const mixed = '<p>React 是一个用于构建用户界面的 JavaScript library</p>';
    const result = readingTime(mixed);
    expect(result).toMatch(/^\d+ 分钟$/);
  });

  it('should handle empty content', () => {
    expect(readingTime('')).toBe('1 分钟');
  });

  it('should strip HTML tags', () => {
    const html = '<h2>Title</h2><p>Content here</p><pre><code>code block</code></pre>';
    expect(readingTime(html)).toBe('1 分钟');
  });
});
