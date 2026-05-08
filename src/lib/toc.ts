export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^一-鿿a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseToc(html: string): { items: TocItem[]; html: string } {
  if (!html) return { items: [], html: '' };
  const items: TocItem[] = [];
  const usedIds = new Map<string, number>();

  const modifiedHtml = html.replace(
    /<h([23])\b[^>]*?>(.*?)<\/h\1>/gi,
    (_match: string, level: string, content: string) => {
      const text = content.replace(/<[^>]+>/g, '').trim();
      if (!text) return _match;

      let id = slugify(text);
      if (usedIds.has(id)) {
        const count = usedIds.get(id)! + 1;
        usedIds.set(id, count);
        id = `${id}-${count}`;
      } else {
        usedIds.set(id, 0);
      }

      items.push({ id, text, level: Number(level) });
      const safeId = id.replace(/"/g, '&quot;');
      return `<h${level} id="${safeId}">${content}</h${level}>`;
    },
  );

  return { items, html: modifiedHtml };
}
