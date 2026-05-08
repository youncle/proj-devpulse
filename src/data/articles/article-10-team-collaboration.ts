import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（终篇）：AI 编程工具的未来，以及你现在该做的 3 件事',
    excerpt:
      '全系列收官篇，从个人利器升级为团队 AI 基建。涵盖 .claude/ 目录标准化、企业级部署、AI 编程工具格局对比，以及面向新手/进阶/Tech Lead 的行动建议。附完整五级通关路线图。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具', '团队协作'],
    slug: 'claude-code-team-collaboration-guide',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 10 篇，也是最后一篇。感谢你一路走到这里。</p></blockquote>

<p><a href="/blog/claude-code-cursor-guide">Claude Code 通关手册（一）：Cursor 用户转 Claude Code，第一天我就后悔了——后悔没早点用</a></p>
<p><a href="/blog/claude-code-permission-system">Claude Code 通关手册（二）：权限系统搞明白，效率直接翻倍</a></p>
<p><a href="/blog/claude-code-claude-md-guide">Claude Code 通关手册（三）：99%的人不知道的效率秘诀，CLAUDE.md 深度实战</a></p>
<p><a href="/blog/claude-code-slash-commands-guide">Claude Code 通关手册（四）：3 个自定义命令，让你的 Claude Code 快到飞起</a></p>
<p><a href="/blog/claude-code-sub-agent-system">Claude Code 通关手册（五）：子代理系统——给你的 AI 配一个"专家团队"</a></p>
<p><a href="/blog/claude-code-mcp-guide">Claude Code 通关手册（六）：MCP 协议完全指南，Claude Code 最被低估的能力</a></p>
<p><a href="/blog/claude-code-hooks-skills-plugins">Claude Code 通关手册（七）：打造 AI 自动化流水线，Hooks、Skills、Plugins 实战</a></p>
<p><a href="/blog/claude-code-headless-sdk">Claude Code 通关手册（八）：你还在跟 AI 聊天？高手早就用代码驱动了</a></p>
<p><a href="/blog/claude-code-checkpoint-sandbox-github-actions">Claude Code 通关手册（九）：检查点 + 沙箱 + GitHub Actions，自动化三部曲</a></p>

<p>恭喜你走到了这里。</p>
<p>过去 9 篇文章，你从一个 Claude Code 新手成长为一个能配子代理、装 MCP、写 Hook、用 SDK 编程、搭 GitHub Actions 的"Claude Code 架构师"。</p>
<p>但有一个问题你可能还没想过：<strong>当你一个人用得飞起时，怎么让整个团队都受益？</strong></p>
<p>你配好的 CLAUDE.md、子代理、Skills、Hooks——这些都是你个人的"武器库"。如果团队里 10 个人各自摸索、各自配置，那不叫"团队用 AI"，那叫"10 个人分别用 AI"。</p>
<p>终篇要解决这个问题：<strong>从个人利器到团队基建。</strong> 然后回顾全系列，给你一张清晰的行动路线图。</p>

<h2>一、团队协作：.claude/ 目录就是你的团队 AI 基建</h2>

<h3>核心思路：配置即代码</h3>
<p>回顾一下你的 <code>.claude/</code> 目录里目前有什么：</p>
<pre><code>.claude/
├── CLAUDE.md                    ← 项目规范（全员共享）
├── settings.json                ← 权限 + Hooks（全员共享）
├── settings.local.json          ← 个人偏好（不提交）
├── commands/                    ← Slash 命令（全员共享）
│   ├── review.md
│   └── gen-component.md
├── agents/                      ← 子代理（全员共享）
│   ├── code-reviewer.md
│   ├── test-writer.md
│   └── security-auditor.md
└── skills/                      ← 技能包（全员共享）
    └── frontend-standards/
        └── SKILL.md
</code></pre>
<p><strong>把 <code>.claude/</code> 提交到 Git</strong>，就是把团队的 AI 能力标准化了。新人 clone 仓库的那一刻，就自动获得了整个团队积累的 Claude Code 配置。</p>

<h3>CLAUDE.md 的团队维护策略</h3>
<p><strong>分层管理</strong>。项目根目录的 CLAUDE.md 写通用规范，子目录的 CLAUDE.md 写模块级规范。</p>
<p><strong>定期迭代</strong>。每个 Sprint 结束后花 10 分钟回顾：Claude 有没有重复犯什么错？有的话就把对应规则加进 CLAUDE.md。</p>
<p><strong>保持精简</strong>。CLAUDE.md 不是百科全书。只写团队特有的规范和 Claude 经常犯错的地方。</p>

<h3>新人 Onboarding 的 AI 环节</h3>
<pre><code>传统 Onboarding：
1. 开通账号
2. clone 仓库
3. 看文档
4. 读代码

加了 Claude Code 之后：
1. 开通账号
2. clone 仓库
3. 安装 Claude Code
4. 跑一遍 /review 命令熟悉代码规范
5. 让 Claude 给他讲解项目架构
6. 用 Claude 完成第一个 task
</code></pre>

<h3>内部知识沉淀</h3>
<ul>
  <li><strong>Commands 库</strong>：团队常用的操作都变成 Slash 命令（<code>/review</code>、<code>/gen-test</code> 等）</li>
  <li><strong>Agents 库</strong>：不同专业方向的子代理（code-reviewer、test-writer、security-auditor）</li>
  <li><strong>Skills 库</strong>：项目特有的知识包（前端规范、API 设计规范、数据库操作规范）</li>
</ul>

<h2>二、企业级部署概览</h2>

<h3>VS Code 扩展</h3>
<p>Claude Code 有原生的 VS Code 扩展——在 Extensions 里搜 "Claude Code" 安装即可。CLI 和 VS Code 扩展共享同一套 <code>.claude/</code> 配置，团队里有人用终端、有人用 VS Code，完全不冲突。</p>

<h3>云厂商集成</h3>
<ul>
  <li><strong>AWS Bedrock</strong>：设置 <code>CLAUDE_CODE_USE_BEDROCK=1</code></li>
  <li><strong>Google Vertex AI</strong>：设置 <code>CLAUDE_CODE_USE_VERTEX=1</code></li>
  <li><strong>Azure Foundry</strong>：设置 <code>CLAUDE_CODE_USE_FOUNDRY=1</code></li>
</ul>
<p>好处是合规（数据不出云环境）、成本可控、安全（复用现有 IAM 策略）。</p>

<h2>三、监控与成本</h2>
<pre><code>/usage
</code></pre>
<p>在交互模式中查看当前会话的 Token 消耗。</p>
<p><strong>模型选择</strong>：日常开发用 Sonnet，复杂任务切 Opus。</p>
<p><strong>上下文管理</strong>：及时用 <code>/compact</code> 压缩长对话。</p>
<p><strong>任务拆分</strong>：大任务拆成小任务，总成本更低。</p>
<p><strong>自动化加 <code>--max-turns</code></strong>：Headless 模式和 CI/CD 里一定要限制轮次。</p>

<h2>四、AI 编程工具格局：Claude Code 的独特定位</h2>
<pre><code>工具              核心定位
─────────────────────────────────────
GitHub Copilot    "最轻量的 AI 辅助"
                  代码补全为主，嵌入 IDE
Cursor            "AI 原生 IDE"
                  深度集成到编辑器体验
Claude Code       "可编程的 AI 开发平台"
                  终端优先，SDK/API 完整
Windsurf          "AI 协作 IDE"
                  强调 Agent 式协作流程
国产工具          通义灵码 / MarsCode 等
                  本土化集成
</code></pre>
<p>这些工具不是非此即彼的。很多开发者在 IDE 里用 Copilot 做补全，遇到复杂任务切到 Claude Code 做深度分析和重构，CI/CD 里用 Headless 模式做自动审查。</p>
<p><strong>Claude Code 的独特价值在三个字：可编程。</strong></p>

<h2>五、全系列回顾——五级通关路线图</h2>
<pre><code>Level 1 · 入门篇
  第1篇：安装 + 核心概念 + 第一次对话
  第2篇：权限系统 + 安全配置
  成果：Claude Code 能安全地跑起来

Level 2 · 配置篇
  第3篇：CLAUDE.md + 上下文管理
  第4篇：Slash 命令 + 模型切换
  成果：Claude Code 跑得顺、跑得快

Level 3 · 扩展篇
  第5篇：子代理系统（专家团队分工）
  第6篇：MCP 协议（连接外部世界）
  第7篇：Hooks + Skills + Plugins（自动化）
  成果：Claude Code 的能力扩展了 10 倍

Level 4 · 自动化篇
  第8篇：Headless 模式 + Agent SDK（代码驱动 AI）
  第9篇：GitHub Actions + 检查点 + 沙箱
  成果：Claude Code 7×24 全自动

Level 5 · 协作篇
  第10篇：团队协作 + 企业部署 + 总结
  成果：从个人利器升级为团队 AI 基建

完整路径：安装 → 配置 → 扩展 → 自动化 → 团队化
</code></pre>

<h2>六、你现在该做的 3 件事</h2>

<h3>如果你是新手</h3>
<ol>
  <li>把第 1-2 篇的配置跑通——安装 + 权限系统</li>
  <li>写好你的第一份 CLAUDE.md</li>
  <li>创建 2-3 个常用的 Slash 命令</li>
</ol>

<h3>如果你已有基础，想进阶</h3>
<ol>
  <li>创建你的第一个子代理——从 code-reviewer 开始</li>
  <li>装上 GitHub MCP + Context7</li>
  <li>配一个 PostToolUse Hook 自动格式化代码</li>
</ol>

<h3>如果你是 Tech Lead，考虑团队推广</h3>
<ol>
  <li>把 <code>.claude/</code> 目录提交到 Git</li>
  <li>配好 GitHub Actions 自动审查</li>
  <li>在一个试点项目上先跑起来</li>
</ol>

<h2>写在最后</h2>
<p>回头看这个系列，DevPulse 作为贯穿始终的案例项目，从一个简单的 Next.js 博客平台，逐步配备了完整的 AI 开发基建：CLAUDE.md、权限系统、子代理、MCP、Hooks、Skills、Headless 脚本、GitHub Actions、检查点、沙箱——每一篇的配置和代码你都可以直接搬到你自己的项目里。</p>
<p>AI 编程工具的发展速度极快。今天学到的具体命令和配置，半年后可能会有变化。但有一些东西不会变：<strong>对自动化的追求、对安全的重视、对可编程性的理解、以及把个人能力升级为团队基建的思维方式。</strong></p>
<p>这才是这个系列真正想传递的东西。</p>
<hr/>
<p><strong>全系列 10 篇，完结。感谢阅读。</strong></p>
    `.trim(),
  };
