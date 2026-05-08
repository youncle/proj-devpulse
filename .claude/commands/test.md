---
description: 为组件或函数生成单元测试
argument-hint: <文件路径>
---

为以下代码生成完整的单元测试：

## 测试要求

- 测试框架：Vitest + React Testing Library
- 测试文件位置：与源文件同级的 `__tests__/` 目录下
- 文件命名：`ComponentName.test.tsx` 或 `functionName.test.ts`

## 测试覆盖范围

1. **正常路径**：组件正常渲染、函数正常返回
2. **边界情况**：空值、undefined、空数组、超长字符串
3. **错误处理**：网络请求失败、无效参数
4. **用户交互**：点击、输入、表单提交（如果是交互组件）
5. **Props 变化**：不同 Props 组合下的渲染结果

## 代码规范

- 每个测试用例用中文注释说明"测试什么场景"
- describe 用组件名 / 函数名
- it / test 的描述用英文（保持与团队一致）
- 使用 screen.getByRole 优先于 getByTestId
- Mock 外部依赖，不要发真实网络请求

## 示例格式

```typescript
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () => {
  // 正常渲染：传入完整的文章数据
  it('should render article title and author', () => {
    // ...
  });

  // 边界情况：文章摘要为空
  it('should handle empty excerpt gracefully', () => {
    // ...
  });
});

## 测试目标

$ARGUMENTS
