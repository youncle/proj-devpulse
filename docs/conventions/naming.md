# 命名规范

## 文件命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 组件文件 | `PascalCase.tsx` | `ArticleCard.tsx` |
| Hook 文件 | `camelCase.ts` | `useDebounce.ts` |
| 工具函数 | `camelCase.ts` / `kebab-case.ts` | `formatDate.ts` |
| 类型定义 | `camelCase.ts` | `types.ts` |
| 测试文件 | 与被测文件同名 + `.test` | `ArticleCard.test.tsx` |
| 页面路由 | `kebab-case` | `user-profile/page.tsx` |

## 代码命名

| 类型 | 格式 | 示例 |
|------|------|------|
| React 组件 | `PascalCase` | `export function UserProfile()` |
| Hooks | `camelCase` + `use` 前缀 | `export function useAuth()` |
| 普通函数 | `camelCase` | `export function formatDate()` |
| Props 接口 | `ComponentNameProps` | `interface ButtonProps` |
| 状态类型 | `State` 后缀 | `interface AuthState` |
| 枚举 | `PascalCase`，值 `UPPER_CASE` | `enum Status { DRAFT, PUBLISHED }` |
| 常量 | `UPPER_CASE` | `const MAX_RETRY_COUNT = 3` |
| 布尔变量 | 前缀 `is` / `has` / `should` | `isLoading`, `hasError` |

## 目录结构命名

```
src/
  app/          — 路由组件，用 (group) 组织
  components/
    ui/         — 通用 UI（Button, Input）
    features/   — 业务组件（ArticleCard, AuthForm）
  lib/          — 纯函数、工具、第三方封装
  types/        — 全局共享类型
