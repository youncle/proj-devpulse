import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（七）：打造 AI 自动化流水线，Hooks、Skills、Plugins 实战',
    excerpt:
      '深入解析 Claude Code 的 Hooks 自动化触发器、Skills 智能技能库和 Plugins 一键分发系统，打造一套完整的 AI 自动化开发流水线。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具', 'Hooks', 'Skills', 'Plugins'],
    slug: 'claude-code-hooks-skills-plugins',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 7 篇，共 10 篇。Level 3（扩展篇）收官之作。这篇讲完，你就拥有了一套完整的 Claude Code 自动化体系。</p></blockquote>

<p>到目前为止，你已经有了一个相当强的 Claude Code 配置：</p>
<ul>
  <li><strong>子代理</strong>（第 5 篇）= 你的"AI 专家团"</li>
  <li><strong>MCP</strong>（第 6 篇）= 专家团的"信息通道"</li>
</ul>
<p>但有一个问题——所有操作都需要你<strong>主动触发</strong>。你说一句，Claude 做一步。你忘了说"跑一下 lint"，它就不跑。你忘了说"查一下类型"，它就不查。</p>
<p>今天要解决的就是这个问题。</p>
<p><strong>Hooks</strong> = 流水线上的自动触发器。Claude 每次写完代码自动跑 Prettier，每次执行危险命令前自动拦截，每次会话结束自动记录日志——你设定好规则，剩下的全自动。</p>
<p><strong>Skills</strong> = 可复用的专业知识包。Claude 根据任务自动加载对应的技能——写组件时加载前端规范，写 API 时加载后端规范，不需要你手动指定。</p>
<p><strong>Plugins</strong> = 一键分发的工具箱。把 Commands + Agents + Skills + Hooks + MCP 打包成一个可安装的插件，团队里的每个人 <code>/plugin install</code> 一秒搞定。</p>
<p>三个系统各解决一个问题，组合起来就是一条<strong>全自动的 AI 开发流水线</strong>。</p>

<h2>一、Hooks 系统——在 Claude 的每一步插入自动化</h2>

<h3>什么是 Hooks？</h3>
<p>一句话：<strong>Hooks 是你预先定义的脚本，在 Claude 操作的特定时刻自动执行。</strong></p>
<p>打个比方：工厂流水线上有很多"质检工位"——产品经过某个环节后自动进行质检，不合格的自动拦下。Hooks 就是 Claude Code 流水线上的质检工位。</p>
<p>关键词是<strong>确定性</strong>。你在 CLAUDE.md 里写"每次修改文件后请跑 lint"，这是一个"请求"——Claude 可能执行，也可能忘了。但 Hook 是<strong>保证执行</strong>——只要事件触发，脚本一定跑，没有例外。</p>

<h3>生命周期事件全景</h3>
<p>Claude Code 目前支持 14 个生命周期事件。日常最常用的是这几个：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│         Hooks 生命周期（精选高频事件）                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  SessionStart                                            │
│  → 会话启动时触发                                         │
│  → 适合：加载环境变量、注入开发上下文                      │
│       ↓                                                  │
│  UserPromptSubmit                                        │
│  → 用户提交提示词时触发                                   │
│  → 适合：校验输入、注入额外上下文                          │
│       ↓                                                  │
│  PreToolUse                                              │
│  → Claude 准备执行操作前触发                               │
│  → 适合：拦截危险命令、修改操作参数                        │
│  → matcher 过滤：Bash / Edit / Write / Read 等            │
│       ↓                                                  │
│  [Claude 执行操作]                                        │
│       ↓                                                  │
│  PostToolUse                                             │
│  → 操作完成后触发                                         │
│  → 适合：自动格式化、运行 lint、记录日志                   │
│  → matcher 过滤：同上                                     │
│       ↓                                                  │
│  Stop                                                    │
│  → Claude 完成回答时触发                                   │
│  → 适合：收尾操作、发送通知                                │
│                                                          │
│  其他事件：                                                │
│  PermissionRequest — 权限弹窗时触发（可自动放行/拦截）     │
│  SubagentStop — 子代理完成时触发                          │
│  PostToolUseFailure — 工具执行失败时触发                   │
│  Notification — 通知事件（适合发桌面提醒）                  │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>

<h3>三种 Hook 类型</h3>
<pre><code>┌──────────────────────────────────────────────────────────┐
│          三种 Hook 处理器                                   │
├──────────┬──────────────────┬────────────────────────────┤
│ 类型      │ 工作方式          │ 适合场景                    │
├──────────┼──────────────────┼────────────────────────────┤
│ command  │ 执行 bash 命令    │ 确定性操作：格式化、lint、   │
│          │ （最常用）        │ 日志记录、文件校验           │
├──────────┼──────────────────┼────────────────────────────┤
│ prompt   │ 调用 LLM 评估    │ 需要智能判断：代码质量评估、 │
│          │                  │ 安全风险分析                 │
├──────────┼──────────────────┼────────────────────────────┤
│ agent    │ 启动子代理处理    │ 复杂任务：全面审查、         │
│          │                  │ 多维度分析                   │
└──────────┴──────────────────┴────────────────────────────┘</code></pre>
<p>日常开发 90% 的场景用 <code>command</code> 类型就够了——执行一个 bash 命令，简单、快速、确定性强。</p>

<h3>配置位置</h3>
<p>Hooks 配置在 settings.json 中（跟第 2 篇的权限配置是同一个文件体系）：</p>
<ul>
  <li><code>~/.claude/settings.json</code>——全局（所有项目生效）</li>
  <li><code>.claude/settings.json</code>——项目级（提交到 Git）</li>
  <li><code>.claude/settings.local.json</code>——个人本地（不提交）</li>
</ul>
<p>也可以在交互模式中用 <code>/hooks</code> 命令可视化编辑。</p>

<h2>实操：3 个最实用的 Hook</h2>

<h3>Hook 1：代码修改后自动格式化</h3>
<p>这是使用频率最高的 Hook——Claude 每次写入或编辑文件后，自动跑 Prettier 格式化。</p>
<p>在 <code>.claude/settings.json</code> 中添加：</p>
<pre><code>{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}</code></pre>
<p>解读一下这段配置：</p>
<ul>
  <li><strong>事件</strong>：<code>PostToolUse</code>——工具执行完成后</li>
  <li><strong>matcher</strong>：<code>Write|Edit|MultiEdit</code>——只在文件写入或编辑操作后触发（正则语法）</li>
  <li><strong>命令</strong>：从 stdin 接收 JSON 输入，提取文件路径，然后对该文件跑 Prettier</li>
  <li><code>exit 0</code>：确保即使 Prettier 报错也不会阻塞 Claude 的流程</li>
</ul>
<p><strong>效果</strong>：从此 Claude 写的每一行代码都自动遵循你的 Prettier 配置，不用你在 CLAUDE.md 里写"请遵循代码格式"，也不用你手动跑 <code>prettier --write</code>。</p>

<h3>Hook 2：危险命令拦截</h3>
<p>这个 Hook 在 Claude 执行 bash 命令<strong>之前</strong>检查，如果是危险命令就直接拦截：</p>
<pre><code>{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); cmd=d.get('tool_input',{}).get('command',''); blocked=['rm -rf /','DROP TABLE','DROP DATABASE',':(){:|:&};:']; sys.exit(2) if any(b in cmd for b in blocked) else sys.exit(0)\""
          }
        ]
      }
    ]
  }
}</code></pre>
<p>关键知识点：</p>
<ul>
  <li><strong>事件</strong>：<code>PreToolUse</code>——工具执行<strong>之前</strong>（可以拦截）</li>
  <li><strong>exit code 2</strong>：表示"拒绝执行"，Claude 会收到拒绝原因</li>
  <li><strong>exit code 0</strong>：表示"放行"</li>
</ul>
<p>这是你的最后一道安全防线——即使权限配置有遗漏，这个 Hook 也能兜底拦住破坏性命令。</p>

<h3>Hook 3：敏感文件保护</h3>
<p>防止 Claude 修改不该碰的文件：</p>
<pre><code>{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(x in p for x in ['.env','package-lock.json','.git/','prisma/migrations/']) else 0)\""
          }
        ]
      }
    ]
  }
}</code></pre>
<p>这个 Hook 阻止 Claude 修改 <code>.env</code>、<code>package-lock.json</code>、<code>.git/</code> 目录和 Prisma 迁移文件。这些文件要么包含敏感信息，要么由工具自动生成，不应该被 AI 手动修改。</p>

<h3>DevPulse 完整 Hooks 配置</h3>
<p>把三个 Hook 组合起来，这是 DevPulse 项目的完整配置：</p>
<pre><code>{
  "permissions": {
    "...": "（第2篇配置的权限，此处省略）"
  },
"hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); cmd=d.get('tool_input',{}).get('command',''); blocked=['rm -rf /','DROP TABLE','DROP DATABASE']; sys.exit(2) if any(b in cmd for b in blocked) else sys.exit(0)\""
          }
        ]
      },
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json,sys; d=json.load(sys.stdin); p=d.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(x in p for x in ['.env','package-lock.json','.git/']) else 0)\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null; exit 0"
          }
        ]
      }
    ]
  }
}</code></pre>
<p>三层防护：操作前拦截危险命令 → 操作前保护敏感文件 → 操作后自动格式化。</p>

<h2>二、Skills 系统——Claude 的"技能库"</h2>

<h3>跟 Slash 命令有什么区别？</h3>
<p>第 4 篇讲了 Slash 命令（<code>.claude/commands/</code>），Skills 看起来也是 Markdown 文件，也有 frontmatter——它们有什么区别？</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│          Slash Commands vs Skills                         │
├──────────────────┬───────────────────────────────────────┤
│ Slash Commands    │ Skills                                │
├──────────────────┼───────────────────────────────────────┤
│ 你主动调用        │ Claude 根据任务自动加载                │
│ /review file.ts  │ 你说"写个组件"→ 自动加载前端规范       │
├──────────────────┼───────────────────────────────────────┤
│ 简单的提示词模板  │ 可包含脚本、模板、参考文档              │
├──────────────────┼───────────────────────────────────────┤
│ 单个 .md 文件    │ 一个目录（SKILL.md + 附属文件）        │
├──────────────────┼───────────────────────────────────────┤
│ 适合：固定操作    │ 适合：需要上下文感知的专业知识          │
│ "每次审查用这个"  │ "写前端时自动知道我们的规范"            │
├──────────────────┼───────────────────────────────────────┤
│ 位置：            │ 位置：                                 │
│ .claude/commands/ │ .claude/skills/                       │
│ ~/.claude/        │ ~/.claude/skills/                     │
│ commands/         │                                       │
└──────────────────┴───────────────────────────────────────┘

简单记忆：
Commands = 你说"做这个" → Claude 执行（主动触发）
Skills = Claude 看到任务 → 自动调取对应技能（被动匹配）</code></pre>
<p>Skills 使用<strong>渐进式披露</strong>策略加载——Claude 启动时只读取每个 Skill 的名称和描述（约 30-50 Token），发现当前任务匹配某个 Skill 时才加载完整内容。所以你可以安装很多 Skill 而不用担心上下文爆炸。</p>

<h3>创建一个 Skill：前端代码规范</h3>
<pre><code>mkdir -p .claude/skills/frontend-standards</code></pre>
<p>创建 <code>.claude/skills/frontend-standards/SKILL.md</code>：</p>
<pre><code>---
name: frontend-standards
description: 前端开发规范 — React/Next.js 组件设计、TypeScript 类型、Tailwind 样式约定
match: (?i)(component|componente|komponente|jsx|tsx|tailwind|ui|layout|render|hook|state|props)
---

# 前端开发规范

## 组件设计原则
- 单一职责：一个组件只做一件事。如果超过 150 行，考虑拆分
- 组件命名使用 PascalCase，文件命名与组件名一致
- Props 接口命名：XxxProps，始终导出

## Server / Client 组件
- 默认服务端组件，只在需要交互时添加 'use client'
- 客户端组件尽量薄：只处理交互，数据在服务端获取
- 服务端组件可以 import 客户端组件，反之不行

## TypeScript 规范
- 禁止 any，用 unknown 或具体类型
- 优先用 interface 定义 Props，type 定义联合类型
- 泛型函数参数用 T 前缀（TData、TResponse）

## Tailwind 规范
- 颜色使用 Tailwind 语义化变量，避免硬编码色值
- 暗色模式用 dark: 前缀
- 响应式断点：sm(640) / md(768) / lg(1024) / xl(1280)</code></pre>
<p><strong>关键字段：match</strong></p>
<p><code>match</code> 字段定义了匹配规则（正则表达式）。当你的任务描述中的词汇匹配到这个正则时，Claude 会自动加载这个 Skill。</p>
<p>比如你输入"帮我在首页加一个组件"，Claude 看到"组件"这个词匹配了 <code>frontend-standards</code> 的 match 规则，就会自动加载这个 Skill。你完全不需要手动指定。</p>

<h2>三、Plugins 系统——一键分发你的配置</h2>

<h3>什么是 Plugin？</h3>
<p>前面 7 篇你配置了一大堆东西：权限规则、CLAUDE.md、子代理、Slash 命令、MCP 服务、Hooks、Skills。如果团队新来了一个人，他要把所有这些配一遍——想想就头疼。</p>
<p>Plugin 就是解决这个问题的：<strong>把你的 Commands + Agents + Skills + Hooks + MCP 打包成一个可安装的插件包。</strong></p>

<h3>Plugin 的结构</h3>
<p>一个 Plugin 就是一个遵循特定结构的目录：</p>
<pre><code>my-plugin/
├── plugin.json          # 插件元数据（必须）
├── CLAUDE.md            # 插件文档（可选，自动合并到项目 CLAUDE.md）
├── commands/            # Slash 命令（可选）
│   └── review.md
├── agents/              # 子代理（可选）
│   ├── code-reviewer.md
│   ├── test-writer.md
│   └── security-auditor.md
├── skills/              # 技能包（可选）
│   └── frontend-standards/
│       └── SKILL.md
├── mcp.json             # MCP 服务配置（可选）
└── settings.json        # Hooks + 权限配置（可选）</code></pre>
<p><code>plugin.json</code> 示例：</p>
<pre><code>{
  "name": "devpulse-toolkit",
  "version": "1.0.0",
  "description": "DevPulse 项目专用工具包 —— 审查、测试、安全审计一条龙",
  "minClaudeVersion": "1.0.0",
  "settings": {
    "merge": "merge"
  }
}</code></pre>

<h3>安装 Plugin</h3>
<p>在 Claude Code 中运行：</p>
<pre><code>/plugin install ./path/to/my-plugin</code></pre>
<p>或者从 GitHub 仓库安装：</p>
<pre><code>/plugin install https://github.com/your-org/devpulse-toolkit</code></pre>
<p>所有配置自动合并到项目里，不需要手动复制粘贴。</p>

<h2>三套系统协作全景</h2>
<p>一个完整的开发场景中，三套系统是这样协作的：</p>
<pre><code>你：帮我在首页加一个用户信息组件

Claude：
  1. Skills 系统检测到"组件"关键词
     → 自动加载 frontend-standards 技能
     → 知道组件规范、命名规则、类型要求

  2. 开始写组件代码
     → Hooks PostToolUse 触发
     → 自动跑 Prettier 格式化

  3. 写完组件后执行 npm run lint
     → Hooks PostToolUse 触发
     → 如果 lint 报错，自动修复

  4. 涉及用户数据
     → Hooks PreToolUse 检查是否有敏感文件操作
     → 安全放行

  结果：一个符合全部规范、格式正确、类型安全的组件
  你做了多少事？就说了一句话。</code></pre>
<p>这就是你的 Claude Code 自动化流水线——<strong>你描述需求，系统自动调取专业知识，自动保证代码质量，自动兜底安全红线。</strong></p>

<h2>本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，Hooks 是<strong>确定性自动化</strong>——在 Claude 的 14 个生命周期节点上插入脚本，保证执行。三个必配的 Hook：PostToolUse 自动格式化、PreToolUse 危险命令拦截、PreToolUse 敏感文件保护。</p>
<p><strong>第二</strong>，Skills 是<strong>被动技能</strong>——通过 <code>match</code> 正则匹配自动加载，使用渐进式披露策略不占上下文。Commands（主动触发）和 Skills（被动匹配）是互补关系。</p>
<p><strong>第三</strong>，Plugin 是<strong>一键分发</strong>——把 Commands + Agents + Skills + Hooks + MCP 打包成插件，<code>/plugin install</code> 一秒部署到团队。</p>

<h2>下篇预告</h2>
<p><strong>第 8 篇：Claude Code 通关手册（八）—— Headless 模式 + SDK：用代码指挥 AI</strong></p>
<p>下一篇进入 Level 4（自动化篇）。我们要让 Claude Code 脱离终端交互——用 TypeScript 代码直接调用 Claude 的完整能力，构建你自己的 AI 自动化工具。</p>
    `.trim(),
  };
