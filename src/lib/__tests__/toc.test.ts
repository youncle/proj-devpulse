import { parseToc } from '../toc';

describe('parseToc', () => {
  it('should extract headings from HTML', () => {
    const html = '<h2 id="intro">介绍</h2><p>内容</p><h2 id="detail">详情</h2>';
    const result = parseToc(html);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].text).toBe('介绍');
    expect(result.items[1].text).toBe('详情');
  });

  it('should add id to headings without id', () => {
    const html = '<h2>Hello World</h2>';
    const result = parseToc(html);
    expect(result.html).toContain('id="hello-world"');
  });

  it('should handle duplicate heading text', () => {
    const html = '<h2>Intro</h2><h2>Intro</h2>';
    const result = parseToc(html);
    expect(result.html).toContain('id="intro-1"');
  });

  it('should handle h3 headings', () => {
    const html = '<h3>Sub Section</h3>';
    const result = parseToc(html);
    expect(result.items[0].level).toBe(3);
  });

  it('should handle headings with inline tags', () => {
    const html = '<h2><strong>Bold Title</strong></h2>';
    const result = parseToc(html);
    expect(result.items[0].text).toBe('Bold Title');
  });

  it('should handle empty HTML', () => {
    const result = parseToc('');
    expect(result.items).toHaveLength(0);
    expect(result.html).toBe('');
  });

  it('should handle HTML without headings', () => {
    const html = '<p>Just a paragraph</p>';
    const result = parseToc(html);
    expect(result.items).toHaveLength(0);
    expect(result.html).toBe(html);
  });

  it('should sanitize id attribute', () => {
    const html = '<h2>Title <strong>with</strong> special chars</h2>';
    const result = parseToc(html);
    expect(result.items[0].id).toBe('title-with-special-chars');
    expect(result.items[0].text).toBe('Title with special chars');
  });

  it('should handle mixed h2 and h3', () => {
    const html = '<h2>Main</h2><h3>Sub</h3><h2>Main2</h2>';
    const result = parseToc(html);
    expect(result.items).toHaveLength(3);
    expect(result.items[0].level).toBe(2);
    expect(result.items[1].level).toBe(3);
  });
});
