---
description: 审查当前分支相对于 master 的所有改动
allowed-tools: Bash(git diff:*), Bash(git log:*)
---

## 当前分支信息

- 分支名：!`git branch --show-current`
- 相对 master 的改动文件：!`git diff --name-only master`
- 改动详情：!`git diff master`

## 审查要求

审查以上所有改动，按文件逐个分析：
1. 改动是否合理、完整
2. 是否引入了新的问题
3. 测试覆盖是否充分

给出整体评分（1-10）和改进建议。
