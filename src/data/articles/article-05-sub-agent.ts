import type { Article } from '@/types/article';

export const article: Article =   {
    title: 'Claude Code 通关手册（五）：子代理系统——给你的 AI 配一个"专家团队"',
    excerpt:
      '深入解析 Claude Code 子代理系统——从原理到实操，创建 code-reviewer、test-writer、security-auditor 三个子代理，为 DevPulse 搭建 AI 专家团队。',
    date: '2026-03-12',
    category: '人工智能',
    tags: ['Claude Code', 'AI', '开发工具', '子代理'],
    slug: 'claude-code-sub-agent-system',
    content: `
<blockquote><p>这是「Claude Code 通关手册」系列的第 5 篇，共 10 篇。从这篇开始进入 Level 3（扩展篇），也是整个系列最有"差异化竞争力"的部分。</p></blockquote>

<p>想象一个场景。</p>
<p>你是一个 Tech Lead，手下有三个专家——一个代码质量专家、一个测试工程师、一个安全顾问。你把一个 PR 链接丢到群里说"审一下"，三个人各自打开代码，从各自的专业角度分析，半小时后各出一份报告汇总到你桌上。</p>
<p>你只做一件事：看报告，做决定。</p>
<p>现在把"三个专家"换成"三个 AI 子代理"。你说一句"审查一下这个模块"，三个子代理同时开工——一个查代码质量、一个生成测试、一个扫描安全漏洞——各自在独立的上下文窗口里工作，互不干扰，最后把结果汇总给主 Agent。</p>
<p><strong>这不是概念演示，这是 Claude Code 子代理系统现在就能跑的东西。</strong></p>
<p>今天我把它讲透——从原理到实操，从创建你的第一个子代理到为 DevPulse 搭建一个三人"专家团队"。</p>

<h2>为什么需要子代理？——"全科医生"的天花板</h2>
<p>前面几篇，你一直在跟 Claude Code 的"主 Agent"一对一对话。它确实很强，但你用久了就会发现三个瓶颈：</p>
<p><strong>瓶颈一：上下文窗口是有限的。</strong></p>
<p>打个比方：你的桌子就这么大（上下文窗口就这么多 Token）。你让 Claude 同时看 20 个文件、记住你的编码规范、理解项目架构、还要分析性能问题——桌子上堆满了纸，它开始翻不过来了。分析质量肉眼可见地下降。</p>
<p><strong>瓶颈二：不同任务需要不同的"专业视角"。</strong></p>
<p>代码审查要关注的点和安全审计要关注的点完全不同。让一个 Agent 同时扮演审查专家和安全专家，就像让一个医生同时做心脏手术和脑科手术——不是做不到，是做不好。</p>
<p><strong>瓶颈三：串行处理，效率有上限。</strong></p>
<p>主 Agent 处理任务是排队的——先做 A、再做 B、再做 C。但很多任务其实可以并行——审查代码和写测试完全可以同时进行。</p>
<p>子代理系统解决了这三个问题：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│         子代理解决的三个核心问题                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  问题                   子代理的解决方案                   │
│  ─────────────────────────────────────────                │
│  上下文窗口不够用       每个子代理有独立的上下文窗口        │
│                        → 互不干扰，各自深度分析             │
│                                                          │
│  缺少专业分工           每个子代理有专属系统提示            │
│                        → 代码专家只管代码，安全专家只管安全 │
│                                                          │
│  串行效率低             最多 7 个子代理并行工作             │
│                        → 三份报告同时出，时间不变           │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>
<p>用更直观的比方来说：</p>
<p>主 Agent 是你公司的"全科医生"——什么都能看，但看不深。子代理是你配的"专科医生团队"——心内科、骨科、神经科各管各的，每个人在自己的诊室（独立上下文）里看病，最后把诊断结果汇总给你这个主治医生。</p>

<h2>子代理的运行机制</h2>
<p>在动手之前，先花一分钟理解子代理是怎么运行的：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│            子代理运行流程                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  你: "审查 @src/app/api/ 下的所有 API 路由"               │
│      ↓                                                   │
│  ┌──────────────────────────────────────┐                │
│  │  主 Agent（调度中心）                  │                │
│  │  分析任务 → 选择合适的子代理           │                │
│  │  或者：你手动指定用哪个子代理          │                │
│  └──────┬──────────┬──────────┬─────────┘                │
│         ↓          ↓          ↓                          │
│  ┌──────────┐┌──────────┐┌──────────┐                   │
│  │code      ││test      ││security  │                   │
│  │reviewer  ││writer    ││auditor   │                   │
│  │          ││          ││          │                   │
│  │独立上下文 ││独立上下文 ││独立上下文 │                   │
│  │独立权限   ││独立权限   ││独立权限   │                   │
│  │专属提示词 ││专属提示词 ││专属提示词 │                   │
│  └──────┬───┘└──────┬───┘└──────┬───┘                   │
│         ↓          ↓          ↓                          │
│  ┌──────────────────────────────────────┐                │
│  │  主 Agent（汇总结果）                  │                │
│  │  整合三份报告 → 呈现给你               │                │
│  └──────────────────────────────────────┘                │
│                                                          │
│  关键特性：                                               │
│  • 每个子代理有自己的上下文窗口（最大 200K）               │
│  • 子代理只接收自己的系统提示，不会继承主 Agent 的全部上下文│
│  • 最多 7 个子代理同时并行                                │
│  • 子代理完成后返回摘要给主 Agent                         │
│                                                          │
└──────────────────────────────────────────────────────────┘</code></pre>
<p>关键点：<strong>子代理的上下文是隔离的。</strong> 它不会继承你跟主 Agent 之间的长对话历史，只接收自己的系统提示和被委派的具体任务。这正是它的优势——干净的上下文 = 聚焦的分析。</p>

<h2>创建你的第一个子代理</h2>
<p>子代理的定义文件跟 Slash 命令一样简单——一个 Markdown 文件搞定。</p>
<p><strong>文件位置</strong>：</p>
<ul>
  <li><code>.claude/agents/</code>——项目级（提交到 Git，团队共享）</li>
  <li><code>~/.claude/agents/</code>——全局个人级（所有项目可用）</li>
</ul>
<p><strong>最小示例</strong>：</p>
<pre><code>mkdir -p .claude/agents</code></pre>
<p>创建 <code>.claude/agents/code-reviewer.md</code>：</p>
<pre><code>---
name: code-reviewer
description: 审查代码质量，关注 TypeScript 类型安全、React 最佳实践和性能问题
tools: Read, Glob, Grep
model: sonnet
---

你是一个严格但公正的代码审查专家，专注于 React + TypeScript 项目。

## 你的审查原则
- 先理解代码意图，再指出问题
- 每个问题必须给出修改建议，不要只说"这里有问题"
- 区分严重程度：🔴 必须修复 / 🟡 建议优化 / 🟢 可选改进

## 审查清单
1. TypeScript 类型安全（any、类型断言、缺失类型）
2. 组件设计（单一职责、Props 接口、Server/Client 划分）
3. 性能隐患（不必要重渲染、缺少 memo、常量提取）
4. 可读性（命名、注释、代码结构）

## 输出格式
按文件逐个分析，每个问题包含：
- 📍 位置（文件名 + 行号范围）
- ❓ 问题描述
- ✅ 修改建议（附代码）</code></pre>
<p>就这样，一个子代理就创建好了。</p>
<p><strong>加载方式</strong>：子代理在会话启动时自动加载。如果你在会话中新建了文件，用 <code>/agents</code> 命令可以立即加载，不用重启。</p>

<p><strong>调用方式</strong>：</p>
<pre><code># 手动指定调用
使用 code-reviewer 子代理审查 @src/components/ArticleCard.tsx

# 或者直接描述任务，Claude 自动匹配
审查一下 ArticleCard 组件的代码质量
# → Claude 看到 code-reviewer 的描述匹配，自动委派</code></pre>

<h2>实操：为 DevPulse 搭建三人专家团队</h2>
<p>现在给 DevPulse 项目创建三个各司其职的子代理。</p>

<h3>子代理一：code-reviewer（代码审查专家）</h3>
<p><code>.claude/agents/code-reviewer.md</code>：</p>
<pre><code>---
name: code-reviewer
description: 代码质量审查。检查 TypeScript 类型安全、React/Next.js 最佳实践、性能隐患和代码可读性。
tools: Read, Glob, Grep
model: sonnet
---

你是 DevPulse 项目的代码审查专家。这是一个基于 Next.js 14（App Router）+
TypeScript strict + Tailwind CSS 的技术博客平台。

## 审查优先级（从高到低）

### P0 — 必须修复
- any 类型（用 unknown 或具体类型替代）
- 类型断言（as）没有充分理由
- 服务端组件中误用了 useState/useEffect 等客户端 Hook
- 客户端组件没有标注 'use client'
- 缺少错误边界处理

### P1 — 强烈建议
- 组件超过 150 行未拆分
- Props 接口未导出或命名不规范（应为 XxxProps）
- 使用 index 作为列表 key
- 内联定义大型对象或函数（应提取到组件外部）
- 缺少 loading 和 error 状态处理

### P2 — 可选优化
- 可用 React.memo 优化但未使用
- 命名可以更清晰
- 缺少 JSDoc 注释

## 输出格式
对每个文件，输出：

**[文件名]**
| 级别 | 位置 | 问题 | 建议 |
|------|------|------|------|
| 🔴P0 | L15-20 | 使用了 any 类型 | 替换为 ArticleData 接口 |

最后给出整体评分（1-10）和一句话总结。</code></pre>
<p>注意这里的 <code>tools: Read, Glob, Grep</code>——<strong>只给了只读权限</strong>。审查专家只需要看代码，不需要改代码。这就是最小权限原则。</p>

<h3>子代理二：test-writer（测试工程师）</h3>
<p><code>.claude/agents/test-writer.md</code>：</p>
<pre><code>---
name: test-writer
description: 为组件和函数编写单元测试和集成测试。使用 Vitest + React Testing Library。
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

你是 DevPulse 项目的测试工程师。你的职责是为代码编写高质量的自动化测试。

## 技术栈
- 测试框架：Vitest
- 组件测试：React Testing Library
- HTTP Mock：MSW（Mock Service Worker）
- 断言风格：expect + toBe/toEqual/toHaveBeenCalled

## 测试文件约定
- 位置：与源文件同级的 __tests__/ 目录
- 命名：ComponentName.test.tsx 或 functionName.test.ts
- 每个 describe 块对应一个组件或函数

## 测试覆盖策略

### 必须覆盖
- 正常渲染路径（传入典型 Props）
- Props 边界值（空字符串、undefined、空数组）
- 用户交互（点击、输入、提交）
- 错误状态（网络失败、无效数据）

### 选择性覆盖
- 不同 Props 组合的排列
- 异步操作的加载/成功/失败三态
- 无障碍属性（role、aria-label）

## 代码规范
- 每个 it/test 前用中文注释说明"测试什么"
- 优先使用 screen.getByRole，其次 getByText
- 禁止使用 getByTestId（除非实在没有语义化选择器）
- Mock 外部依赖，不发真实请求

## 完成后
- 运行 npx vitest run --reporter=verbose 验证测试通过
- 报告测试覆盖数据</code></pre>
<p>这个子代理需要 <code>Write</code> 和 <code>Edit</code> 权限来创建测试文件，以及 <code>Bash</code> 权限来运行测试命令。</p>

<h3>子代理三：security-auditor（安全审计专家）</h3>
<p><code>.claude/agents/security-auditor.md</code>：</p>
<pre><code>---
name: security-auditor
description: 安全漏洞扫描。检查 XSS、注入攻击、认证绕过、敏感信息泄露等安全风险。
tools: Read, Glob, Grep
model: sonnet
---

你是 DevPulse 项目的安全审计专家。你以攻击者的视角审视代码，
找出潜在的安全漏洞。

## 扫描范围

### 前端安全
- XSS（跨站脚本）：检查 dangerouslySetInnerHTML、未转义的用户输入
- CSRF 防护：表单提交是否有 Token 校验
- 敏感信息泄露：API Key、密码是否出现在客户端代码中
- 客户端存储安全：localStorage 中是否存储了敏感数据

### API 安全
- 注入攻击：SQL 注入、NoSQL 注入、命令注入
- 认证绕过：API 路由是否都检查了 session
- 权限控制：是否存在越权访问的可能
- 输入校验：请求参数是否经过 zod 等工具校验
- 速率限制：是否有暴力攻击防护

### 依赖安全
- 已知漏洞：检查 package.json 中是否有已知 CVE 的依赖
- 供应链风险：是否有不知名或长期未维护的包

## 输出格式

| 风险等级 | 类型 | 位置 | 描述 | 修复方案 |
|---------|------|------|------|---------|
| 🔴 高危 | XSS  | Header.tsx L45 | 未转义的用户输入直接渲染 | 使用 DOMPurify 或移除 dangerouslySetInnerHTML |

最后给出安全评分（A-F）和优先修复建议 Top 3。</code></pre>
<p>同样，安全审计只需要只读权限——它的职责是发现问题，不是修复问题。</p>

<h2>三个子代理的权限设计</h2>
<p>这三个子代理的权限差异是有意为之的：</p>
<pre><code>┌──────────────────────────────────────────────────────────┐
│          子代理权限对比                                     │
├────────────────┬──────────────────┬──────────────────────┤
│ 子代理          │ 权限              │ 设计理由              │
├────────────────┼──────────────────┼──────────────────────┤
│ code-reviewer  │ Read, Glob, Grep │ 只看不改。审查不应该   │
│                │ （只读）           │ 自动修改代码           │
├────────────────┼──────────────────┼──────────────────────┤
│ test-writer    │ Read, Write,     │ 需要创建测试文件和     │
│                │ Edit, Glob,      │ 运行测试命令           │
│                │ Grep, Bash       │                       │
├────────────────┼──────────────────┼──────────────────────┤
│ security-      │ Read, Glob, Grep │ 只看不改。安全审计     │
│ auditor        │ （只读）           │ 不应该改动任何代码     │
└────────────────┴──────────────────┴──────────────────────┘

原则：最小权限。
每个子代理只给它完成任务所必须的权限，多一个都不给。</code></pre>
<p>为什么这么较真？因为子代理是独立运行的——你不会实时看到它的每一步操作。如果给安全审计子代理写权限，万一它"好心"帮你修改了代码但改错了呢？<strong>只读权限 = 零副作用 = 绝对安全。</strong></p>

<h2>使用演示：三种调用方式</h2>

<h3>方式一：手动指定子代理</h3>
<p>最明确的方式，适合你知道该用谁的时候：</p>
<pre><code>使用 code-reviewer 子代理审查 @src/app/api/posts/route.ts</code></pre>
<pre><code>用 security-auditor 扫描 @src/app/api/ 目录下所有 API 路由的安全漏洞</code></pre>
<pre><code>让 test-writer 为 @src/components/ArticleCard.tsx 编写单元测试</code></pre>

<h3>方式二：自然语言描述，Claude 自动委派</h3>
<p>你不需要记住子代理的名字——只要任务描述足够清晰，Claude 会根据每个子代理的 <code>description</code> 字段自动匹配最合适的那个：</p>
<pre><code>帮我检查这个 API 有没有 SQL 注入风险
→ Claude 自动选择 security-auditor</code></pre>
<pre><code>给这个组件写几个单元测试
→ Claude 自动选择 test-writer</code></pre>
<pre><code>看一下这段代码有没有性能问题
→ Claude 自动选择 code-reviewer</code></pre>

<h3>方式三：多子代理并行工作</h3>
<p>这是子代理系统最强大的用法——一次委派，多个专家同时开工：</p>
<pre><code>让 code-reviewer、test-writer 和 security-auditor 同时处理 @src/app/api/auth/ 目录，
code-reviewer 审查代码质量，
test-writer 编写测试，
security-auditor 扫描安全漏洞。</code></pre>
<p>三个子代理在独立的上下文窗口中并行工作。对主 Agent 来说，等待时间 = 最慢的那个子代理的完成时间，而不是三个串行的时间总和。</p>
<p>你得到的是三份独立的、从各自专业角度出发的分析报告，而不是一份"面面俱到但面面不深"的综合报告。</p>

<h2>最佳实践与注意事项</h2>

<p><strong>1. 选择合适的模型</strong></p>
<p>子代理的 frontmatter 中可以指定 <code>model</code>。对于审查、测试编写这类任务，<code>sonnet</code> 完全够用，比 <code>opus</code> 便宜很多。把 opus 留给需要深度推理的主 Agent 任务。</p>

<p><strong>2. 限制子代理的工作范围</strong></p>
<p>在系统提示中明确告诉子代理它应该关注什么、不应该关注什么。比如 code-reviewer 只审查代码质量，不需要它检查安全性——那是 security-auditor 的事。</p>

<p><strong>3. 子代理数量不是越多越好</strong></p>
<p>最多 7 个并行。但实际使用中，3-4 个专业子代理 + 1 个主 Agent 的配置最为高效。太多子代理并行反而增加了汇总成本。</p>

<p><strong>4. 子代理文件可以随时修改</strong></p>
<p>修改 <code>.claude/agents/</code> 下的文件后，运行 <code>/agents</code> 命令热加载，不需要重启会话。可以根据项目阶段的演进调整子代理的提示词。</p>

<h2>本篇小结</h2>
<p>三个核心收获：</p>
<p><strong>第一</strong>，子代理系统的本质是<strong>专业分工 + 独立上下文 + 并行执行</strong>。每个子代理有专属的系统提示、独立的上下文窗口和独立的权限，最多 7 个同时并行工作。</p>
<p><strong>第二</strong>，创建子代理只需要一个 Markdown 文件，放在 <code>.claude/agents/</code> 目录下。Frontmatter 定义名称、描述、权限和模型，正文定义系统提示。用 <code>/agents</code> 热加载。</p>
<p><strong>第三</strong>，<strong>最小权限原则</strong>至关重要——审查和安全类子代理只给只读权限，只有需要创建文件的子代理（如 test-writer）才给写权限。</p>

<h2>下篇预告</h2>
<p><strong>第 6 篇：Claude Code 通关手册（六）—— MCP 协议：连接整个开发生态</strong></p>
<p>下一篇我们继续 Level 3 扩展篇。子代理解决了"团队协作"的问题，MCP 协议要解决的是"工具集成"的问题——让 Claude Code 直接操作你的数据库、文件系统、第三方 API，构建真正跨平台的自动化工作流。</p>
    `.trim(),
  };
