/**
 * 估算文章阅读时间
 * 中文按 ~300 字/分钟，英文按 ~200 词/分钟
 */
export function readingTime(content: string): string {
  const cleanText = content.replace(/<[^>]+>/g, '');
  const chineseChars = (cleanText.match(/[一-鿿]/g) || []).length;
  const englishWords = cleanText
    .replace(/[一-鿿]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.round(chineseChars / 300 + englishWords / 200));
  return `${minutes} 分钟`;
}
