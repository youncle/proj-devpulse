# Git 工作流规范

> 完整版见 [docs/conventions/git-workflow.md](docs/conventions/git-workflow.md)

## 核心约束

- 分支命名：`type/description`（如 `feat/article-search`、`fix/login-redirect`）
- Commit 格式：`type(scope): description`（英文）
  - type: feat / fix / docs / refactor / test / chore
  - scope: 改动模块（blog / auth / api / ui / deps）
- PR 标题同 Commit 格式，Body 包含 `## Summary` 和 `## Test plan`
- 禁止直接 push master，所有改动走 PR + Code Review
