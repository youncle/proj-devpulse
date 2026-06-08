# 测试规范

> 完整版见 [docs/conventions/testing.md](docs/conventions/testing.md)

## 核心约束

- 框架：Vitest + React Testing Library + jsdom
- 文件位置：与源文件同级的 `__tests__/` 目录下
- 命名：`ComponentName.test.tsx` / `functionName.test.ts`
- 禁止在测试中发真实网络请求（Mock 外部依赖）
- 优先 `screen.getByRole` > `getByText` > `getByTestId`（最后手段）
- 每个 `it/test` 前用中文注释说明测试场景
