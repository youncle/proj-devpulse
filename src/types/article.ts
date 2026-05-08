/** 文章元数据 */
export interface Article {
  /** 文章唯一标识 */
  id?: string;
  /** 文章标题 */
  title: string;
  /** 文章摘要 */
  excerpt: string;
  /** 发布日期，格式 YYYY-MM-DD */
  date: string;
  /** 所属分类 */
  category: string;
  /** 标签列表 */
  tags: string[];
  /** URL 友好标识，用于生成文章链接 /blog/{slug} */
  slug: string;
  /** 文章完整内容（HTML 格式） */
  content: string;
}
