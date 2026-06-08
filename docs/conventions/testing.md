# 测试规范（完整版）

> AI 摘要见 `.claude/rules/testing.md`

## 技术栈

- 运行器：Vitest v3
- 组件测试：React Testing Library v16
- DOM 环境：jsdom v25
- HTTP Mock：MSW

## 文件组织

```
src/components/features/ArticleCard.tsx
src/components/features/__tests__/ArticleCard.test.tsx
src/lib/formatDate.ts
src/lib/__tests__/formatDate.test.ts
```

## 测试覆盖策略

### 必须覆盖
- 正常渲染/执行路径
- Props 边界值（空、undefined、空数组、超长字符串）
- 用户交互（点击、输入、提交）
- 错误状态（API 失败、无效数据）
- Loading 状态（异步操作）

### 选择性覆盖
- 多种 Props 组合
- 无障碍属性（role、aria-label、aria-describedby）

## 编写规范

```typescript
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () => {
  // 正常渲染：传入完整的文章数据
  it('should render title and author', () => {
    render(<ArticleCard title="Hello" author="Alice" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello');
  });

  // 边界情况：摘要为空时不应显示摘要区域
  it('should not render excerpt section when excerpt is empty', () => {
    render(<ArticleCard title="Hello" author="Alice" excerpt="" />);
    expect(screen.queryByTestId('excerpt')).not.toBeInTheDocument();
  });
});
```
