# Harness Engineering × Claude Code 落地方案（DevPulse）

本文档描述如何在 DevPulse 项目中结合 Harness Engineering 方法论和 Claude Code 工具，提升开发效率和代码质量。按照三阶段（信息层 → 约束层 → 自动化层）逐步落地，而不是一次性上完所有基础设施。

---

## 一、总体思路

- **工程目标**：
  - 让 Agent（Claude Code）“看得懂”项目 → 输出稳定、符合规范。
  - 用 Linter / CI 把团队约定变成“机械规则” → 减少口头沟通和主观审查。
  - 通过脚本和流程，让 Agent 能自验证、自清理 → 降低长期维护成本。

- **三阶段路线**：

  - **Phase 1：信息层（1–2 天）**
    - 建立 `AGENTS.md` 地图模式。
    - 搭建 `docs/` 目录结构，沉淀架构与规范。
    - 让 Claude Code 每次进项目都有“导航页”。

  - **Phase 2：约束层（3–5 天）**
    - 用 ESLint/Linter 锁定分层架构和编码规范。
    - 用 GitHub Actions 配置 Harness 风格 CI（类型检查 + Lint + 测试 + 结构化约束）。
    - Linter 报错即 Prompt：问题 + 修复方式 + 文档链接。

  - **Phase 3：自动化层（1–2 周）**
    - 编写 Agent 自验证脚本，形成“写代码→跑验证→修复”的闭环。
    - 用 Claude Code 定期执行仓库清理任务（超长文件、缺失测试等）。

建议先完成 Phase 1，等习惯后再逐步引入 Phase 2/3。

---

## 二、Phase 1：信息层——让 Claude Code 看得懂仓库

### 2.1 AGENTS.md：项目地图

在项目根目录新增 `AGENTS.md`，控制在 50–100 行以内，采用“你想做什么 → 去哪里看”的导航式结构。例如：

```markdown
# AGENTS.md

## 项目简介
DevPulse：基于 Next.js 14 + PostgreSQL + Prisma 的技术博客平台（部署在 Vercel）。

## 快速导航
| 你想做什么         | 去哪里看                           |
|--------------------|------------------------------------|
| 了解整体架构       | CLAUDE.md / 项目概述              |
| 看模块边界         | docs/architecture/overview.md     |
| 看编码规范         | CLAUDE.md / 编码规范              |
| 看常用命令         | README.md / 常用命令              |
| 看 API / 数据库    | prisma/schema.prisma（后补）       |

## 硬性规则（CI 会验证）
1. 使用 TypeScript strict 模式，禁止 any。
2. 页面默认 Server Component，交互组件必须 'use client'。
3. 新增 API 必须有对应的请求/错误处理测试。
4. 图片用 next/image，链接用 next/link。
5. 不提交 .env.*，环境变量只放本地/CI 配置。

## 提交规范
- feat: 新功能
- fix: Bug 修复
- refactor: 重构
- docs: 文档
- test: 测试相关
```

**使用方式**（Claude Code）：

- 每次在该仓库中使用 Claude Code 时，第一条指令：
  > 请先阅读项目根目录的 `AGENTS.md` 和 `CLAUDE.md`，后续所有改动必须遵守其中规则。

---

### 2.2 docs/：结构化知识库骨架

在项目中建立最基础的文档目录结构（可按需扩展）：

```bash
mkdir -p docs/architecture docs/conventions
```

建议先补两个核心文档：

1. `docs/architecture/overview.md`

   - 描述当前项目分层和依赖规则，例如：

   ```markdown
   # DevPulse 架构概览

   src/
   ├── app/          # Next.js App Router
   ├── components/   # UI + 业务组件
   ├── lib/          # 工具函数、配置
   ├── types/        # 类型定义
   └── prisma/       # DB schema & migrations

   ## 依赖规则（初版）
   - types/ 不依赖其他业务代码
   - lib/ 只依赖 types/
   - components/ 只依赖 types/ + lib/
   - app/ 可以依赖所有层
   ```

2. `docs/conventions/README.md`

   - 总结已在 `CLAUDE.md` 中存在的编码规范：

   ```markdown
   # 编码规范总览

   - 组件声明：使用 `function`，不用箭头导出。
   - Props 类型命名：`ComponentNameProps`。
   - 禁止 any，所有类型必须显式声明。
   - 默认 Server Component，需要交互时 `use client`。
   - 图片使用 next/image，链接使用 next/link。
   ```

**使用方式**（Claude Code）：

- 需要讨论架构 / 规范时，不再口头描述，而是：
  > 请基于 `docs/architecture/overview.md` 和 `docs/conventions/README.md`，
  > 帮我设计/修改 XXX 功能的实现方案。

---

## 三、Phase 2：约束层——把约定变成 Linter / CI 规则

### 3.1 GitHub Actions：Harness 风格质量闸门

在仓库中新建 `.github/workflows/harness-checks.yml`，用于 PR 质量门控：

```yaml
name: Harness Checks

on:
  pull_request:
    branches: [ main ]

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Typecheck
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test -- --passWithNoTests

      - name: File size check
        run: |
          find src/ -name '*.ts' -o -name '*.tsx' | while read f; do
            lines=$(wc -l < "$f")
            if [ "$lines" -gt 300 ]; then
              echo "❌ $f: $lines lines (max 300)"
              echo "✅ FIX: 拆分为更小的模块或抽到 lib/ / components/features/"
              exit 1
            fi
          done
```

在 GitHub 仓库设置中：

- 对 `main` 分支启用保护规则：要求 PR 且 Harness Checks 通过后才能合并。

**使用方式**（Claude Code）：

- 在改任何较大功能前，告知 Claude Code：
  > 所有改动必须通过 `.github/workflows/harness-checks.yml` 的检查：
  > `tsc --noEmit`、`npm run lint`、`npm test` 和文件行数限制。
  > 请在修改代码的同时补全必要的测试，使上述检查可以通过。

- CI 失败时，将关键日志贴给 Claude Code，让其根据错误和规则修复。

---

### 3.2 自定义 ESLint 规则：错误信息即 Prompt

目标：

- 把常见的 code review 意见（例如“禁止裸 fetch()”、“组件不要直接访问某层”）固化为 ESLint 规则。
- 每条规则的报错信息包含：
  - ❌ 问题描述
  - ✅ 具体修复示例（最好包含代码片段）
  - 📖 文档链接

示例：禁止裸 `fetch()`，统一使用 API Client。

`eslint-harness-rules.cjs`：

```js
module.exports = {
  rules: {
    'no-raw-fetch': {
      meta: {
        type: 'problem',
        messages: {
          noRawFetch: [
            '❌ 禁止直接使用 fetch()。',
            '✅ FIX: 使用封装好的 API 客户端，例如 lib/api-client.ts：',
            '   import { apiClient } from "@/lib/api-client";',
            '   const data = await apiClient.get("/endpoint");',
            '📖 See: docs/conventions/api-calls.md'
          ].join('\n')
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.name === 'fetch') {
              context.report({ node, messageId: 'noRawFetch' });
            }
          }
        };
      }
    }
  }
};
```

在 `.eslintrc.json` 中引入上述规则文件并开启 `no-raw-fetch`。

**效果**：

- Claude Code 写出违反规范的代码时，运行 `npm run lint` 会看到详细错误。
- 它可以直接根据错误中的 FIX 指南自动修复，无需额外 Prompt。

---

## 四、Phase 3：自动化层——自验证与仓库清理

### 4.1 Agent 自验证脚本

目标：

- 把“本地验证流程”（安装依赖、类型检查、Lint、测试）封装为统一脚本。
- Claude Code 在完成功能后可以主动调用该脚本进行自验证。

示例脚本（适用于 Git Bash/WSL 等环境）：`scripts/agent-verify.sh`

```bash
#!/usr/bin/env bash
set -e

BRANCH=${1:-"HEAD"}
WORKDIR="/tmp/devpulse-agent-verify-$(date +%s)"

echo "🔧 创建 worktree: $WORKDIR"
git worktree add "$WORKDIR" "$BRANCH"

cd "$WORKDIR"

echo "📦 npm ci ..."
npm ci --silent

echo "🔍 tsc --noEmit ..."
npx tsc --noEmit

echo "🔍 npm run lint ..."
npm run lint

echo "🧪 npm test ..."
npm test

echo "✅ 所有本地验证通过"

cd -
git worktree remove "$WORKDIR" --force
```

**使用方式**（Claude Code）：

- 在任务描述中明确：
  > 完成实现后，请确保等价执行了以下验证步骤：
  > - `npm ci`
  > - `npx tsc --noEmit`
  > - `npm run lint`
  > - `npm test`
  > 确认所有检查通过后再给出最终 diff 或提交建议。

- 你可以手动运行该脚本验证 Claude Code 的改动。

---

### 4.2 仓库“后台清理任务”

把长期的代码卫生工作交给 Claude Code，结合 Harness 约束定期执行：

建议的清理清单：

1. 找出 `src/` 下超过 300 行的文件，给出拆分方案并实施拆分。
2. 找出 `lib/` 和 `components/features/` 中缺失测试的关键模块，补 1–2 个基础测试。
3. 清理多余的 `console.log`，必要时改为结构化日志。
4. 检查 `AGENTS.md`、`CLAUDE.md`、`docs/` 是否与实际代码结构不一致，并给出修改建议。

示例 Prompt：

> 你现在是 DevPulse 仓库的“代码卫生 Agent”。\
> 请按照以下顺序清理代码，每一类清理生成单独提交：\
> 1）找出 src/ 下超过 300 行的文件，给出拆分建议并实现；\
> 2）找出 lib/ 和 components/features 中没有测试的核心模块，为每个模块补充基础测试；\
> 3）清理多余的 console.log，如有必要改为结构化日志；\
> 每一步都需通过 `npm run lint` 和 GitHub 的 Harness Checks。

---

## 五、在 DevPulse 中使用 Claude Code 的推荐流程

可以将以下流程固化为团队约定，写入 `docs/conventions/agent-usage.md`：

1. **需求阶段：先有变更工件，再写代码**
   - 对于中大型改动，先补一份简短设计说明（可放入 `docs/design/feature-xxx.md`），包含：
     - 目标 / 非目标
     - 涉及文件与目录范围（允许改动的路径）
     - 验收标准（接口行为、UI 行为、测试要求）
   - 可以让 Claude Code 根据需求草拟设计，再由人审核修改。

2. **实现阶段：带着约束让 Claude Code 写代码**
   - 使用 Claude Code 改代码前，明确告知：
     - 遵守 `AGENTS.md`、`CLAUDE.md`、`docs/conventions/README.md`。
     - 遵守本次变更对应的 `docs/design/feature-xxx.md` 设计说明。
     - 只修改设计中列出的文件/目录，除非我额外允许。
     - 所有改动必须通过 Harness Checks（类型检查、Lint、测试、行数限制）。
   - 要求 Claude Code：
     - 同步补充/更新测试用例。
     - 解释关键改动点（便于 Code Review）。

3. **验证阶段：固定验证闭环**
   - 本地手动执行或等价执行：
     - `npm ci`
     - `npx tsc --noEmit`
     - `npm run lint`
     - `npm test`
   - 推 PR 后由 GitHub Actions 执行 `harness-checks.yml`，确保所有 Gate 通过。
   - 对于 CI 失败，将错误日志贴给 Claude Code，让其在当前约束下修复。

4. **清理与维护阶段：结合 Claude 做“代码卫生”**
   - 定期（例如每两周）让 Claude Code 执行一次“代码卫生清理”任务（参考第 4 节清单）。
   - 每月回顾一次 Linter/CI 规则，评估是否需要新增、修改或放宽某些约束。
   - 遇到新的常见问题：
     - 先在 `AGENTS.md` / `docs/conventions` 中补充规则说明；
     - 再考虑写成 Linter/CI 规则，实现自动化拦截。

---

## 六、硬护栏与高风险区域

为了防止 Claude Code 对关键基础设施和配置做出危险修改，建议在项目和对话中明确以下“硬护栏”：

### 6.1 高风险文件 / 目录（默认禁止修改）

除非在具体任务中明确说明“可以修改”，否则 Claude Code 不应主动改动：

- 环境与配置相关：
  - `next.config.mjs`
  - 未来可能新增的部署 / 基础设施配置目录（如 `infra/`, `deploy/`, `scripts/deploy/` 等）
- 环境变量与密钥：
  - 所有 `.env*` 文件
  - 任何包含密钥、令牌的文件（即使在本地，也不应由 Agent 生成真实值）
- 数据库迁移与 schema（如果后续接入 Prisma）：
  - `prisma/migrations/` 目录
  - 生产环境正在使用的 schema 变更应由人工评审

对 Claude Code 的约定用语示例：

> 除非我在任务说明中明确写出“可以修改 X”，否则请不要改动配置 / 环境变量 / 基础设施 / 迁移相关文件；\
> 当前任务只允许在 `src/` 和文档目录（`docs/`, `README`, `CLAUDE.md`, `AGENTS.md` 等）中进行修改。

### 6.2 命令与操作的安全边界（预留）

当前在本项目中不通过 Claude Code 直接执行 shell / Git 命令，但可以预先约定：

- 不建议由 Agent 直接执行以下高风险操作，即使未来接入命令执行能力：
  - `git push`、强制覆盖远程分支的 Git 操作；
  - `rm -rf` 或任何删除大量文件的命令；
  - 直接对生产环境执行的部署、数据库迁移命令（如 `kubectl`, `psql`, `prisma migrate deploy` 等）。
- 如需执行此类操作，应由人类在本地 / CI 环境中手动完成。

这些硬护栏可以先以“文档 + 对话约定”的形式存在，未来如在本地增加脚本或 Hook（如 Git 钩子、工具层封装），可以进一步强化为自动拦截。

---

## 七、落地清单

**Phase 1：信息层**
- [ ] 创建 `AGENTS.md`（控制在 50–100 行，地图模式）。
- [ ] 建立 `docs/architecture/overview.md` 与 `docs/conventions/README.md`。
- [ ] 约定：使用 Claude Code 前先加载、遵守上述文档。

**Phase 2：约束层**
- [ ] 在 `.github/workflows/harness-checks.yml` 中配置类型检查 + Lint + 测试 + 文件行数限制。
- [ ] 为常见 bad pattern 编写自定义 ESLint 规则（报错含 ❌ + ✅ + 📖）。
- [ ] 在 GitHub 上为 `main` 启用分支保护，强制 Harness Checks 通过后才能合并。
- [ ] 明确高风险文件 / 目录清单，并在团队内约定默认不由 Agent 修改。

**Phase 3：自动化层**
- [ ] 编写并维护 `scripts/agent-verify.sh` 或等价验证流程。
- [ ] 定期执行“代码卫生清理”任务，由 Claude Code 辅助完成。
- [ ] 持续审查和更新 AGENTS 文档与 Linter/CI 规则，使其与项目演进保持同步。

通过以上步骤，可以让 Claude Code 在 DevPulse 中不仅“能写代码”，而且**在明确规则和自动化约束下写出可维护、高质量的代码**，真正实现 Harness Engineering 的工程化落地。