# TypeScript 规范

> 完整版见 [docs/conventions/typescript.md](docs/conventions/typescript.md)

## 核心约束

- tsconfig 已开启 `strict: true`
- 禁止 `any` — 用 `unknown` + 类型收窄 或具体类型
- Props 类型命名：`ComponentNameProps`（如 `ArticleCardProps`）
- 有限使用类型断言 `as`，必须有注释说明原因
- interface 用于对象类型，type 用于联合/交叉类型
