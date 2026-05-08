---
description: 自动 commit 当前改动
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
model: claude-3-5-haiku-20241022
---

## 上下文

- 当前 git 状态：!`git status`
- 当前改动详情：!`git diff HEAD`

## 任务

基于以上改动，生成一个规范的 commit message 并提交。

格式要求：type(scope): description
- type: feat / fix / docs / refactor / test / chore
- scope: 改动涉及的模块（如 blog、auth、api）
- description: 简短的英文描述

$ARGUMENTS
